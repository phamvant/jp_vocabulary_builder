export async function getSentences({ str }: { str: string[] }) {
  const data = [];

  for (let i = 0; i < str.length; i++) {
    const ret = await fetch("https://mazii.net/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify content type
      },
      body: JSON.stringify({
        dict: "javi",
        type: "example",
        query: str[i],
      }),
    });

    if (!ret.ok) {
      continue;
    }

    const sentences = (await ret.json()).results;

    const sentence = sentences[Math.floor(Math.random() * sentences.length)];
    data.push(sentence);
  }

  return data;
}
