export function capitalizeFirstLetter(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
export function capitalizeEachWord(sentence: string) {
  const words = sentence.split(" ");

  const capitalizedWords = words.map((word: string) => {
    return capitalizeFirstLetter(word);
  });

  return capitalizedWords.join(" ");
}
