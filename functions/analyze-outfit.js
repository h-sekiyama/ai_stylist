const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async function(event, context) {
    // CORSヘッダーの設定
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // OPTIONSリクエストの処理
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const prompt = `あなたはファッションの専門家です。以下の条件に基づいて、明日着る服のコーディネートを提案してください：

1. 季節や天気を考慮する
2. カジュアルで日常的に着やすい組み合わせを提案する
3. 具体的なアイテムの組み合わせを提案する
4. そのコーディネートのポイントや着こなしのコツも説明する

以下のような形式で提案してください：

1. トップス：[具体的なアイテム]
2. ボトムス：[具体的なアイテム]
3. アウター：[具体的なアイテム]
4. シューズ：[具体的なアイテム]
5. アクセサリー：[具体的なアイテム]

ポイント：[着こなしのポイントやコツ]`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "あなたはファッションの専門家です。ユーザーの手持ちの服から、最適なコーディネートを提案してください。"
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                suggestion: completion.choices[0].message.content
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'コーディネートの分析中にエラーが発生しました。'
            })
        };
    }
}; 