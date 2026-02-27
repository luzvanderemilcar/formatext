import { readFile } from '/fileReader.js';
import { TextReverter } from './rearranger.js';
import { writeOnClipboard, readFromClipboard } from './clipboard.js';

  
  let localStorageIsAvailable;

// disable permissions check for clipboard
let enablePermissionsCheck = false;

if (typeof(Storage) !== "undefined") {
  // localStorage is supported. Use the API methods here.
  localStorageIsAvailable = true;
} else {
  // No web storage support.
  localStorageIsAvailable = false;
}

let resultText;

// select elements
let textProcessorAlgorithmSelect = document.getElementById("algorithm");


let formElement = document.getElementById("reformation");
let fileReadContainer = document.getElementById("file-read-container");
let fileImportOnButton = document.getElementById("import-on");
let fileInput = document.getElementById("file1");
let readFileButton = document.getElementById("read-file1");

// 
let textAreaElement = document.getElementById("original-text");

const resultElement = document.getElementById("result");
const pasteButton = document.getElementById("paste-clipboard");
const clearButton = document.getElementById("clear");
const copyButton = document.getElementById("copy-clipboard");

  // change the current algorithm
  if (localStorageIsAvailable) {
  // use possible stored algorithm type for the reverter
  let currentReverter = localStorage.getItem("currentReverter");
  
   setInputValue(localStorage.getItem("textValue"));
  
  if (currentReverter) {
    setCurrentReverter(currentReverter);
    textProcessorAlgorithmSelect.value = currentReverter;
  }
}

  textProcessorAlgorithmSelect.addEventListener("change", changeCurrentTextReverter);
  
  function changeCurrentTextReverter(e) {
    let reverterAlgorithm = e.target.value;
    
    // change current reverter
    setCurrentReverter(reverterAlgorithm);
  }
  
  function setCurrentReverter(reverter) {
    TextReverter.setCurrent(reverter);
    
    // save into local storage
    if (localStorageIsAvailable) localStorage.setItem("currentReverter", reverter);
    
    let allowedFileSourceExtensions = TextReverter.getCurrent().getAllowedFileSourceExtensions();
    
    // allowed file source extensions are specified
    if (allowedFileSourceExtensions) {
      fileInput.setAttribute("accept", allowedFileSourceExtensions.join(", "));
    } else {
      
      if (fileInput.hasAttribute("accept")) fileInput.removeAttribute("accept")
    }
    
    // get text to process
    let textValue = getInputValue();
    
    // process reversion
    if (textValue && showProcessResult) showProcessResult(textValue)
  }
  
  
  // Events listeners
  fileImportOnButton.addEventListener("click", function(e) {
    fileReadContainer.classList.remove("hidden");
    e.target.classList.add("hidden");
  });
  
  fileInput.addEventListener('change', function() {
    readFileButton.removeAttribute("disabled");
  });
  
  readFileButton.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (file) {
      readFile(file, processConversion);
    }
  });
  
  pasteButton.addEventListener("click", handlePaste);
  clearButton.addEventListener("click", handleClear);
  
  textAreaElement.addEventListener("focus", () => {
    setResultValue("");
  });
  
  textAreaElement.addEventListener("change", (e) => {
    
    let textValue = e.target.value;
    
    if (localStorageIsAvailable) localStorage.setItem("textValue", textValue);
  });
  
  textAreaElement.addEventListener("input", function() {
    if (fileReadContainer) hide(fileReadContainer);
  });
  
  textAreaElement.addEventListener("blur", (e) => {
    let textValue = e.target.value;
   showProcessResult(textValue);
   show(fileImportOnButton);
  });
  
  resultElement.addEventListener("dblclick", handleCopy);
  
  copyButton.addEventListener("click", handleCopy)
  
  async function handlePaste() {
    try {
      readFromClipboard(enablePermissionsCheck).then(result => {
        if (result) {
          textAreaElement.focus();
          setInputValue(getInputValue() + result);
          textAreaElement.blur();
        } else {
          alert("No text in clipboard");
        }
      });
    } catch (e) {
      console.error(e);
    }
  }
  
  // clear the textarea 
  function handleClear() {
    textAreaElement.focus();
    setInputValue("");
  }
  
  // copy the content of the processed text in the clipboard 
  function handleCopy() {
    if (resultText) {
      writeOnClipboard(resultText, enablePermissionsCheck);
    } else {
      alert("Please type in text before copying");
      textAreaElement.focus()
    }
  }
  
  function handleReformatting(e) {
    e.preventDefault();
    
    let currentForm = e.target;
    
    let { originalText } = formElement.elements;
    
    let reformatted = TextReverter.getCurrent().revert(originalText?.value.trim());
    
    // set the reformatted text
    if (reformatted) setResultValue(reformatted);
  }
  
  /*function createReverter(name, reverterFunction, asCurrent = false) {
    let reverter = new TextReverter(name, asCurrent);
    reverter.setReverterFunction(reverterFunction);
    
    createNewReverterOption(name);
  }
  
  function createNewReverterOption({ option, value }, selectElement) {
    // 
    
  }
  */
  
  /** Convert the textValue into another format
   * @param {string} textValue value entered to be processed
   */
  function showProcessResult(textValue) {
    
    try {
      let processedText = TextReverter.getCurrent().revert(textValue);

    setResultValue(processedText);
    } catch (e) {
      if (/(Syntax|Type)Error/i.test(e.stack)) {
        alert(`Le contenu du texte entrée est different type attendu.`);
      } else {
      console.log(e);
      }
      // clear 
      setResultValue("");
    }
  }
  
  function getInputValue() {
    return textAreaElement.value;
  }
  
  function setInputValue(textValue) {
    textAreaElement.value = textValue;
  }
  
  // get the value of the result *string* format
  /**
   * @return {string} text formatted
   */
  function getResultValue() {
    return resultText;
  }
  
  // set the value of the result
  function setResultValue(textValue) {
    resultElement.innerHTML = textToDivHtml(textValue);
    resultText = textValue;
    if (localStorageIsAvailable) localStorage.setItem("resultText", textValue);
  }
  
  function processConversion(inputValue) {
    setInputValue(inputValue);
    showProcessResult(inputValue);
  }
  
  // show result from text format to html corresponding element
  /**
   * @param {string} textContent text to convert into html conponent
   * @return {TextNode} html text node
   */
  function textToDivHtml(textContent) {
    // Convert newlines to <br> tags for HTML display
    return textContent.replace(/\n/g, '<br>');
  }
  
  /**
   * @param {HTMLElement} element element to show
   */
  function show(element) {
    if (element.classList.contains("hidden")) element.classList.remove("hidden")
  }
    /**
   * @param {HTMLElement} element element to show
   */
  function hide(element) {
    if (!element.classList.contains("hidden")) element.classList.add("hidden")
  }