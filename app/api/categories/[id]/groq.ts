import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function main({ str }: { str: string[] }) {
  const chatCompletion = await getGroqChatCompletion({ str: str });
  // Print the completion returned by the LLM.
  return chatCompletion.choices[0]?.message?.content;
}

async function getGroqChatCompletion({ str }: { str: string[] }) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: `この単語 ${str.toString()} を含む日本語の長い各文を作成します
その単語を空白に置き換えてクイズを作成し、4 つの回答を与えます
json で応答することを忘れないでください [{
"question": "",
"options": [

],
"correct_answer_index":
}]

難しくして、jsonだけを渡して、他に何も言わないでください。`,
      },
    ],
    model: "llama-3.1-70b-versatile",
  });
}
