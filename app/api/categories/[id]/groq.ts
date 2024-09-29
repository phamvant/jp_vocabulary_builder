export async function getSentences({ str }: { str: string[] }) {
  const data = [];

  for (let i = 0; i < str.length; i++) {
    console.log(i);
    const controller = new AbortController(); // Create an AbortController
    const timeoutId = setTimeout(() => controller.abort(), 400); // Abort the request after 200ms

    try {
      const ret = await fetch("https://mazii.net/api/search", {
        signal: controller.signal, // Use the abort signal
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

      clearTimeout(timeoutId); // Clear the timeout if the fetch completes on time

      if (!ret.ok) {
        continue;
      }

      const sentences = (await ret.json()).results;

      const sentence = sentences[Math.floor(Math.random() * sentences.length)];

      if (sentence) {
        sentence.word = str[i];
      }

      data.push(sentence);
    } catch (e: any) {
      if (e.name === "AbortError") {
        console.error(`Request for ${str[i]} timed out`);
      } else {
        console.error(`Error fetching sentence for ${str[i]}:`, e);
      }
      continue;
    }
  }

  console.log(data);
  return data;
}
