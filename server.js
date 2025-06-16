require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// OpenAI APIクライアントの初期化
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// ミドルウェアの設定
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// コーディネート提案のエンドポイント
app.post('/api/analyze-outfit', async (req, res) => {
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

        res.json({ suggestion: completion.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'コーディネートの分析中にエラーが発生しました。' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 