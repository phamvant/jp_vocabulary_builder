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
        content: `create japanese each sentence with this word ${str.toString()} 
make it quiz by replace that word with blank and give 4 answer
remember to response in json [{
"question": "",
  "options": [

  ],
  "correct_answer_index": 
}]
just give me the markdown and don't say anything else`,
      },
    ],
    model: "llama-3.1-70b-versatile",
  });
}
