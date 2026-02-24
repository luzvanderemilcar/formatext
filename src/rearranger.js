class TextReverter {
  static #reverters = [];
  static #current;

  #name;
  #reverterFunction;
  #allowedFileSourceExtensions = [];
  
  
  constructor (name, isCurrentTextReverter=false) {
    this.#name = name;
    // set current reverter
    if (TextReverter.#reverters.length == 0 || isCurrentTextReverter) TextReverter.#current = this;
    TextReverter.#reverters.push(this);
  }
  
  static getReverters() {
    return TextReverter.#reverters;
  }
  
  static getReverter(name) {
    let reverter = TextReverter.#reverters.find(reverter => new RegExp(name, "i").test(reverter.getName()));
    
    return reverter;
  }
  
  static setCurrent(name) {
    TextReverter.#current = TextReverter.getReverter(name);
  }
  
  static getCurrent() {
    return TextReverter.#current;
  }
  
  getName() {
    return this.#name;
  }
  
  setName(newName) {
    this.#name = newName;
  }
  
  getAllowedFileSourceExtensions() {
    return this.#allowedFileSourceExtensions;
  }
  
  setAllowedFileSourceExtensions(extensionList) {
    if (Array.isArray(extensionList) && extensionList.length > 0) this.#allowedFileSourceExtensions = extensionList;
  }
  
  setReverterFunction(functionName) {
    this.#reverterFunction = functionName
  }
  
  getReverterFunction() {
    return this.#reverterFunction;
  }
  
  revert(text) {
    return this.#reverterFunction(text)
  }
}

let whatsapp = new TextReverter("whatsapp");

whatsapp.setReverterFunction(function (text) {
  
  let processedText = text;
  
  let doubleSidedMarkList = ["_", "~", "*", "`", "-"];
  let singleSidedMarkList = [">", "-"];
  
  // for doubleSided symbols 
  if (doubleSidedMarkList?.length > 0) {
    processedText = clearDoubleSidedMarkup(processedText, doubleSidedMarkList, 3);
  }
  
  // for singleSided symbol followed by space
  
  if (singleSidedMarkList?.length > 0) {
    
    processedText = clearSingleSidedMarkup(processedText, singleSidedMarkList, true)
    
  }
  return processedText;
});

let jwlibrary = new TextReverter("jwlibrary", true);

jwlibrary.setReverterFunction(rearrangeVerse);

let markdown = new TextReverter("markdown");

// smpl converter
let smplToM3u = new TextReverter("smpltom3u");

smplToM3u.setReverterFunction(function (smplJson) {
  const members = JSON.parse(smplJson).members;
  
  let m3uContent = '#EXTM3U\n#PLAYLIST:' + JSON.parse(smplJson).name + '\n';
  
  // Sort by order ascending (0 first)
  members.sort((a, b) => a.order - b.order);
  
  members.forEach(member => {
    const filename = member.info.replace(/^.*[\\\/]/, '');
    const title = member.title;
    const artist = member.artist;
    
    m3uContent += `#EXTINF:0,${title} - ${artist}\n${filename}\n`;
  });
  
  return m3uContent;
});

smplToM3u.setAllowedFileSourceExtensions([".smpl"]);

/**
 * @param {string} text string to unmark,
 * @param {Array} singleSidedMarkList array of single mark to take off
 * @param {boolean} followedBySpace boolean that precise whether the given mark is followed by space, default to false
 * @return {string} string processed and unmarked
 */
function clearSingleSidedMarkup(text, singleSidedMarkList, followedBySpace = false) {
  let escapedSymbolString = escapeRegExp(singleSidedMarkList.join(""));
  
  // regular expression qui traitent des caractères singuliers et des espaces qui pourraient les suivre
  let singleSidedMarkRegExp = new RegExp(`(?<markupSymbol>[${escapedSymbolString}]+${followedBySpace ? "[ ]+)" : "(?=[^ ]+))"}(?<markedText>[^${escapedSymbolString}]+)`, "g");
  
  return text.replace(singleSidedMarkRegExp, ((match, markupSymbol, markedText, index, groups) => {
    
    //console.log("Match : " + match, "\nMarkup symbol : " + markupSymbol, "\nMarked Text : " + markedText, "\nIndex : " + index, "\nGroups : " + groups)
    return `${markedText}`
  }));
}

/**
 * clear marker that surrounds text blocks
 * @param {string} text the text that is to unmark
 * @param {Array} doubleSidedMarkList a list of the character that are to be removed from the text
 * @param {number} turnCount the number of turn to repeat the process to handle nested markup
 * @return {string} the process text with markups removed
 */
function clearDoubleSidedMarkup(text, doubleSidedMarkList, turnCount = 1) {
  
  let processedText = text;
  let escapedSymbolString = escapeRegExp(doubleSidedMarkList.join(""));
  
  let doubleSidedMarkRegExp = new RegExp(`(?<markupSymbol>[${escapedSymbolString}]+)(?<markedText>[^${escapedSymbolString}]+)\\k<markupSymbol>`, "g");
  
  do {
    processedText = processedText.replace(doubleSidedMarkRegExp, ((match, markupSymbol, markedText, index, groups) => {
      
      // console.log("Match : " + match, "\nMarkup symbol : " + markupSymbol, "\nMarked Text : " + markedText, "\nIndex : " + index, "\nGroups : " + groups)
      return `${markedText}`
    }));
    turnCount--;
  } while (turnCount > 0)
  return processedText;
}

//console.log(clearDoubleSidedMarkup(">*~Eroky ejxh~* ```Martin``* ~kdvdk~", ["*", "~", "`"],2))
//console.log(clearSingleSidedMarkup(">- *Eroky ejxh* ```Martin``* ~kdvdk~ - ksjsvv", ["-", ">"]))


//Rearrange the text of a Bible verse copied from Jw Library

 function rearrangeVerse(text) {
  return text.replace(/(?<versetNumber>\d+)/g, ((match, verseNumber, index, groups) => {
    return ` ${verseNumber}. `
  }));
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|\-[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export {TextReverter};