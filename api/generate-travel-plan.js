// api/generate-travel-plan.js
const { OpenAI } = require('openai');
const path = require('path');

const destinationsModule = {
    getDestinationList: (type) => type === '国内' ? '東京、京都、大阪、北海道、札幌、福岡、沖縄、箱根、金沢、広島、長野' : 'パリ、ロンドン、ニューヨーク、ローマ、バルセロナ、ソウル、バンコク、シンガポール、香港、台北、シドニー',
    getEnglishDestination: (jp) => {
        if (jp.includes('東京')) return 'Tokyo';
        if (jp.includes('京都')) return 'Kyoto';
        if (jp.includes('大阪')) return 'Osaka';
        if (jp.includes('北海道')) return 'Hokkaido';
        if (jp.includes('札幌')) return 'Sapporo';
        if (jp.includes('福岡')) return 'Fukuoka';
        if (jp.includes('沖縄')) return 'Okinawa';
        if (jp.includes('パリ')) return 'Paris';
        if (jp.includes('ロンドン')) return 'London';
        if (jp.includes('ニューヨーク')) return 'New York';
        return jp.includes('国内') ? 'Japan travel scenic' : 'international travel destination';
    },
    isValidDestination: () => true
};

// destinations.jsの正しいパスを設定
// Vercelの環境では相対パスが異なる場合があるので注意
/*let destinationsModule;
try {
    // 複数のパスパターンを試す
    try {
        destinationsModule = require('../js/destinations.js');
    } catch (e) {
        try {
            destinationsModule = require('../public/js/destinations.js');
        } catch (e) {
            try {
                destinationsModule = require(path.join(process.cwd(), 'js', 'destinations.js'));
            } catch (e) {
                destinationsModule = require(path.join(process.cwd(), 'public', 'js', 'destinations.js'));
            }
        }
    }
} catch (error) {
    console.error('destinations.jsの読み込みに失敗しました:', error);
    // フォールバック: 基本的な関数を定義
    destinationsModule = {
        getDestinationList: (type) => type === '国内' ? '東京、京都、大阪、北海道' : 'パリ、ロンドン、ニューヨーク、ローマ',
        getEnglishDestination: (jp) => jp.includes('東京') ? 'Tokyo' : jp.includes('京都') ? 'Kyoto' : 'Japan',
        isValidDestination: () => true
    };
}
*/
const {
    getDestinationList,
    getEnglishDestination,
    isValidDestination
} = destinationsModule;

// OpenAI設定
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// サーバーレス関数
module.exports = async (req, res) => {
    // CORSヘッダー設定
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // OPTIONSリクエストの処理（CORS プリフライト）
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // リクエストが POST でない場合はエラー
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'メソッドが許可されていません' });
    }

    try {
        // リクエストボディを取得
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

        // 必須パラメータのチェック
        if (!mbtiType || !destinationType) {
            return res.status(400).json({ error: '必須パラメータが不足しています' });
        }

        // セッションIDを生成
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
興味: ${interests ? interests.join(', ') : '特になし'}

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
        const userMessage = `${mbtiType}タイプで、${companions}と一緒に${season}に${duration}の${destinationType}旅行を計画しています。予算は${budget}で、${travelStyle}を希望し、${interests ? interests.join('、') : '特になし'}に興味があります。おすすめの旅行プランを教えてください。`;

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

        // 旅行先と画像キーワードを抽出
        const extractedDestination = extractDestination(travelPlanContent);
        const imageKeyword = extractImageKeyword(travelPlanContent, destinationType);
        const englishKeyword = getEnglishDestination(imageKeyword, destinationType);

        // デバッグログ
        console.log('旅行プラン生成完了:', {
            destination: extractedDestination,
            imageKeyword: imageKeyword,
            englishKeyword: englishKeyword
        });

        // レスポンスを返す
        return res.status(200).json({
            sessionId,
            result: travelPlanContent,
            destination: extractedDestination,
            imageKeyword: imageKeyword,
            englishKeyword: englishKeyword
        });

    } catch (error) {
        console.error('Error generating travel plan:', error);
        return res.status(500).json({ error: 'サーバーエラーが発生しました: ' + error.message });
    }
};

// 旅行先を抽出する関数
function extractDestination(content) {
    if (!content) return '指定なし';

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
function extractImageKeyword(content, destinationType) {
    if (!content) return destinationType === '国内' ? '日本 観光地 風景' : '海外 観光地 風景';

    // "画像キーワード: [キーワード]" という形式から抽出
    const keywordMatch = content.match(/画像キーワード:\s*([^\n]+)/);
    if (keywordMatch && keywordMatch[1]) {
        return keywordMatch[1].trim();
    }

    // バックアッププラン: 旅行先から生成
    const destination = extractDestination(content);
    if (destination && destination !== '指定なし') {
        return `${destination} 風景 観光地`;
    }

    // デフォルト値
    return destinationType === '国内' ? '日本 観光地 風景' : '海外 観光地 風景';
}