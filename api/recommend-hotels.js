const { OpenAI } = require('openai');
require('dotenv').config();

// OpenAI設定
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// セッション情報を保存するためのオブジェクト（APIごとのモジュールの外部で定義）
// この部分はVercelではうまく動作しないので、別のサービスを検討する必要があります
const sessionStore = {};

// ホテル推薦API
module.exports = async (req, res) => {
    try {
        const { sessionId } = req.body;
        let userData;

        // セッションIDが提供されている場合、保存されている情報を取得
        if (sessionId && sessionStore[sessionId]) {
            userData = sessionStore[sessionId];
        } else {
            // セッションIDがない場合や無効な場合は、直接リクエストから情報を取得
            userData = req.body;
        }

        const {
            mbtiType,
            destinationType,
            budget,
            duration,
            season,
            companions,
            travelStyle,
            interests,
            extractedDestination
        } = userData;

        // 旅行先情報を使用
        const destination = extractedDestination || '指定なし';

        // システムプロンプトの作成
        const systemPrompt = `あなたはMBTIを理解するホテルコンシェルジュです。以下のユーザー情報に基づいて、おすすめのホテルを3つ提案してください：

MBTIタイプ: ${mbtiType}
旅行先: ${destination}
旅行先タイプ: ${destinationType}
予算: ${budget}
期間: ${duration}
季節: ${season}
同行者: ${companions}
旅行スタイル: ${travelStyle}
興味: ${interests ? interests.join(', ') : '指定なし'}

以下のJSON形式で回答してください：
{
  "hotels": [
    {
      "name": "ホテル名",
      "location": "場所（都市名や住所）",
      "pricePerNight": "1泊あたりの価格（円または現地通貨）",
      "rating": 評価点（5段階）,
      "description": "ホテルの魅力や特徴の簡単な説明",
      "features": ["特徴1", "特徴2", "特徴3"],
      "mbtiMatch": "${mbtiType}タイプの人にこのホテルをおすすめする理由"
    },
    ...続けて2つのホテル情報...
  ]
}

すべての価格は${budget}の予算を考慮して適切なものにしてください。
${mbtiType}タイプの性格特性を考慮して、そのタイプが好むであろうホテルを選んでください。
${companions}との旅行であることも考慮してください。
特に提案された旅行先「${destination}」の実際のホテルを具体的に提案してください。`;

        // ユーザーメッセージの作成
        const userMessage = `${mbtiType}タイプの私が${companions}と${season}に${duration}の${destination}への旅行を計画しています。予算は${budget}で、${interests ? interests.join('、') : ''}に興味があります。${travelStyle}を希望しています。私に合ったホテルを3つ教えてください。`;

        // OpenAI APIを呼び出し
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userMessage }
            ],
            max_tokens: 1500,
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        // レスポンスの内容をログに記録
        console.log("OpenAI APIレスポンス受信");

        // レスポンスをJSON形式でパース
        const responseData = JSON.parse(completion.choices[0].message.content);

        // ホテルデータが正しく含まれているか確認
        if (!responseData.hotels || !Array.isArray(responseData.hotels) || responseData.hotels.length === 0) {
            console.error("有効なホテルデータがありません:", responseData);
            return res.status(404).json({ error: "条件に合うホテルが見つかりませんでした" });
        }

        // ホテルデータに必須フィールドがあるか確認
        const validHotels = responseData.hotels.filter(hotel =>
            hotel.name && hotel.location && hotel.pricePerNight && hotel.description);

        if (validHotels.length === 0) {
            console.error("有効なホテルデータがありません");
            return res.status(404).json({ error: "有効なホテル情報が見つかりませんでした" });
        }

        // レスポンスを返す
        res.json({
            hotels: validHotels,
            destination: destination  // 使用した旅行先情報も返す
        });

    } catch (error) {
        console.error('Error recommending hotels:', error);
        res.status(500).json({ error: 'ホテル情報の取得中にエラーが発生しました' });
    }
};