const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config(); // .envファイルの読み込み

const apiKey = process.env.OPENAI_API_KEY;

/**
 * GPTを利用してテキストから表情を分類
 * @param {string} userInput - ユーザーの音声認識結果
 * @returns {Promise<string>} 表情のカテゴリ (例: "happy", "sad", etc.)
 */
async function classifyEmotion(userInput) {
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // APIキーをヘッダーに設定
    };

    // GPTのシステムメッセージでタスクを明確化
    const systemMessage = `あなたの役割は、テキストを以下の感情カテゴリに分類することです:
    - happy
    - sad
    - angry
    - surprised
    - fearful
    - disgusted
    - neutral
    出力は感情カテゴリの名前のみを返してください。`;

    const data = {
        model: "gpt-4", // 必要に応じてモデルを変更
        messages: [
            { role: "system", content: systemMessage },
            { role: "user", content: userInput },
        ],
        max_tokens: 50, // 必要な応答トークン数
    };

    try {
        console.log("Sending request to GPT API...");
        console.log("Request payload:", JSON.stringify(data, null, 2));

        const response = await axios.post(url, data, { headers });

        console.log("Received response from GPT API:", response.data);

        const result = response.data.choices[0].message.content.trim();
        console.log("Parsed emotion result:", result);

        return result; // 分類された感情を返す
    } catch (error) {
        if (error.response) {
            console.error("API呼び出しエラーのレスポンス:", error.response.data);
        } else {
            console.error("API呼び出し中のエラー:", error.message);
        }
        throw error; // エラーを上位で処理できるようにスロー
    }
}

module.exports = classifyEmotion;
