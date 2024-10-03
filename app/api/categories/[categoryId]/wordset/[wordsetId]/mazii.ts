const getAllData = (words: string[]): Promise<any>[] => {
  return words.map((word) =>
    fetch("https://mazii.net/api/search", {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dict: "javi",
        type: "example",
        query: word,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        data.word = word;
        return data;
      })
      .catch((err) => err),
  );
};

export async function getSentences({ str }: { str: string[] }) {
  const sentences = await Promise.allSettled(getAllData(str));

  const data = sentences.reduce((acc: any[], cur) => {
    if (cur.status === "fulfilled" && cur.value && cur.value.results.length) {
      const sentences = cur.value.results;
      const sentence = sentences[Math.floor(Math.random() * sentences.length)];
      sentence.word = cur.value.word;
      acc.push(sentence);
    }
    return acc;
  }, []);

  return data;
}
