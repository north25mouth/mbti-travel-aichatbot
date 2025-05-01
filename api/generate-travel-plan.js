const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const bodyParser = require('body-parser');
require('dotenv').config();

// destinations.jsから辞書と関数をインポート
const {
    getDestinationList,
    getEnglishDestination,
    isValidDestination
} = require('./utils/destinations.js');

// セッション情報を保存するためのオブジェクト
// 実際のプロダクションでは、Redis等の適切なセッションストアを使用することを推奨
const sessionStore = {};

// OpenAI設定
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// 旅行プラン生成API
module.exports = async (req, res) => {
    try {
        const {
            mbtiType,
            destinationType,
            budget,
            duration,
            season,
            companions,
            travelStyle,
            interests
        } = req.body;

        // セッションIDを生成 (クライアント側で管理するか、より堅牢な方法を検討)
        const sessionId = Date.now().toString();

        // 旅行タイプに基づいた観光地リストを取得
        const destinationList = getDestinationList(destinationType);

        // システムプロンプトの作成
        const systemPrompt = `あなたは若い学生向けのMBTI旅行アドバイザーです。以下の情報に基づいて東京からの旅行プランを提案してください：

MBTIタイプ: ${mbtiType}
旅行先タイプ: ${destinationType}
予算: ${budget}
期間: ${duration}
季節: ${season}
同行者: ${companions}
旅行スタイル: ${travelStyle} 
興味: ${interests.join(', ')}

提案する旅行先は必ず以下のリストから選んでください：
${destinationList}

回答には以下を含めてください：
1. 提案する旅行先名と簡単な説明
2. 提案する旅行先の観光地の画像用のキーワード（例: "京都 清水寺 風景"）
3. なぜその場所が${mbtiType}タイプの人に合っているのか
4. この予算でできる具体的な旅程
5. おすすめアクティビティ（5つ）
6. SNS映えするスポット（3つ）と撮影のコツ
7. 学生向けの節約術
8. ${mbtiType}タイプの旅行者への特別アドバイス

${travelStyle === '定番の人気スポット' ?
            '人気の観光地や定番のスポットを中心に提案してください。' :
            'あまり知られていない穴場スポットやユニークな体験を中心に提案してください。'}

若者向けのフレンドリーな口調で、絵文字も適度に使ってください。学生の視点に立ったアドバイスを心がけてください。
必ず各セクションの前後に改行を入れ、見出しを太字にし、重要ポイントを強調してください。

また、旅行先のメインの都市や地域名を、レスポンス内の最初に "主な旅行先: [都市名/地域名]" という形式で明示的に記載してください。この情報は後続のAPIで利用されます。

さらに、提案する旅行先の画像キーワードを "画像キーワード: [キーワード]" という形式で明示的に記載してください。このキーワードは画像検索APIで使用されます。`;

        // ユーザーメッセージの作成
        const userMessage = `${mbtiType}タイプで、${companions}と一緒に${season}に${duration}の${destinationType}旅行を計画しています。予算は${budget}で、${travelStyle}を希望し、${interests.join('、')}に興味があります。おすすめの旅行プランを教えてください。`;

        // OpenAI APIを呼び出し
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        });

        const travelPlanContent = completion.choices[0].message.content;

        // 旅行先を抽出する関数
        function extractDestination(content) {
            // "主な旅行先: [都市名/地域名]" という形式から抽出
            const destinationMatch = content.match(/主な旅行先:\s*([^\n]+)/);
            if (destinationMatch && destinationMatch[1]) {
                return destinationMatch[1].trim();
            }

            // バックアッププラン: タイトルや最初の段落から推測
            const lines = content.split('\n');
            for (const line of lines) {
                if (line.includes('旅行先') || line.includes('おすすめ') || line.includes('提案')) {
                    // 地名やスポット名を含む可能性がある行から地名を抽出
                    const words = line.split(/[、。：:]/);
                    for (const word of words) {
                        if (word.length > 1 && !word.includes('あなた') && !word.includes('私') && !word.includes('MBTIタイプ')) {
                            return word.trim();
                        }
                    }
                }
            }

            return '指定なし'; // 抽出できない場合のデフォルト値
        }

        // 画像キーワードを抽出する関数
        function extractImageKeyword(content) {
            const keywordMatch = content.match(/画像キーワード:\s*([^\n]+)/);
            if (keywordMatch && keywordMatch[1]) {
                return keywordMatch[1].trim();
            }

            // バックアッププラン: 旅行先から生成
            const destination = extractDestination(content);
            if (destination && destination !== '指定なし') {
                return `${destination} 風景 観光地`;
            }

            return destinationType === '国内' ? '日本 観光地 風景' : '海外 観光地 風景'; // デフォルト値
        }

        // 旅行先と画像キーワードを抽出
        const extractedDestination = extractDestination(travelPlanContent);
        const imageKeyword = extractImageKeyword(travelPlanContent);

        // 英語キーワードを取得
        const englishKeyword = getEnglishDestination(imageKeyword, destinationType);

        // セッション情報を保存（Vercelでは一時的な保存に注意）
        // 後でセッション管理サービスや別のデータストアに移行することを検討
        const sessionData = {
            mbtiType,
            destinationType,
            budget,
            duration,
            season,
            companions,
            travelStyle,
            interests,
            extractedDestination,
            imageKeyword,
            englishKeyword,
            travelPlanContent
        };

        // セッションストアに保存
        sessionStore[sessionId] = sessionData;

        // レスポンスを返す
        res.json({
            sessionId,
            result: travelPlanContent,
            destination: extractedDestination,
            imageKeyword: imageKeyword,
            englishKeyword: englishKeyword
        });

    } catch (error) {
        console.error('Error generating travel plan:', error);
        res.status(500).json({ error: 'サーバーエラーが発生しました' });
    }
};