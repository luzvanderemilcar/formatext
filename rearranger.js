//Rearrange the text of a Bible verse copied from Jw Library

export default function rearrangeVerse(text) {
return text.replace(/(?<versetNumber>\d+)/g, ((match, verseNumber, index, groups) => {
  return ` ${verseNumber}. `
  })
  );
  }