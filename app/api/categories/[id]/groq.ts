import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getSentences({ str }: { str: string[] }) {
  const chatCompletion = await getGroqChatCompletion({ str: str });
  return chatCompletion.choices[0]?.message?.content;
}

async function getGroqChatCompletion({ str }: { str: string[] }) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `${str.toString()}
        その単語を使用した実際の記事や文書からの長い日本語の例文をください。それぞれの文に1つの単語を含めてください。
        {
          "response": {
            "sentences": [
              {
                "word": "",
                "example": "。"
              },
              {
                "word": "",
                "example": "。"
              },
              ...
            ]
          }
        }

        JSONを返してください。それ以外のことは言わないでください`,
      },
    ],
    model: "llama3-8b-8192",
  });
}
