import {TextReverter} from './rearranger.js';
import { writeOnClipboard, readFromClipboard } from './clipboard.js';


// disable permissions check for clipboard
let enablePermissionsCheck = false;

let textProcessorAlgorithmSelect = document.getElementById("algorithm");

let resultText;

let formElement = document.getElementById("reformation");
let textAreaElement = document.getElementById("original-text");

const resultElement = document.getElementById("result");
const pasteButton = document.getElementById("paste-clipboard");
const clearButton = document.getElementById("clear");
const copyButton = document.getElementById("copy-clipboard");
textProcessorAlgorithmSelect.addEventListener("change", setCurrentTextReverter)

function setCurrentTextReverter(e) {
  let reverterAlgorithm = e.target.value;
  TextReverter.setCurrent(reverterAlgorithm);
  let textValue = getInputValue();
    if (textValue) showResult(textValue)
  
}

pasteButton.addEventListener("click", handlePaste);
clearButton.addEventListener("click", handleClear);

textAreaElement.addEventListener("focus", () => {
  setResultValue("");
});

textAreaElement.addEventListener("blur", (e) => {
  let textValue = e.target.value;
  showResult(textValue);
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


function showResult(textValue) {
  let processedText = TextReverter.getCurrent().revert(textValue);
  setResultValue(processedText);
}

function getInputValue() {
  return textAreaElement.value;
}

function setInputValue(textValue) {
  textAreaElement.value = textValue;
}

function getResultValue() {
  return resultText;
}

function setResultValue(textValue) {
  resultElement.innerHTML = textToDivHtml(textValue);
  resultText = textValue;
}

function textToDivHtml(textContent) {
  // Convert newlines to <br> tags for HTML display
  return textContent.replace(/\n/g, '<br>');
}