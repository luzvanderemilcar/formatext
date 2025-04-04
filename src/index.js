import rearranger from './rearranger.js';
import { writeOnClipboard, readFromClipboard } from './clipboard.js';

let processingText = "";

// disable permissions check for clipboard
let enablePermissionsCheck = false;

let formElement = document.getElementById("reformation");
let textAreaElement = document.getElementById("original-text");

const resultElement = document.getElementById("result");
const pasteButton = document.getElementById("paste-clipboard");
const clearButton = document.getElementById("clear");
const copyButton = document.getElementById("copy-clipboard");

pasteButton.addEventListener("click", handlePaste);
clearButton.addEventListener("click", handleClear);

textAreaElement.addEventListener("focus", () => {
  resultElement.innerText = "";
});

textAreaElement.addEventListener("blur", (e) => {
  let textValue = e.target.value;
  processingText = rearranger(textValue);
  resultElement.innerText = processingText;
});

resultElement.addEventListener("dblclick", handleCopy);

copyButton.addEventListener("click", handleCopy)

async function handlePaste() {
  try {
    readFromClipboard(enablePermissionsCheck).then(result => {
    if (result) {
    textAreaElement.focus();
    textAreaElement.value += result;
    textAreaElement.blur();
    } else {
      alert("No text in clipboard");
    }
    });
  } catch (e) {
    console.error(e);
  }
}
function handleClear(param) {
  textAreaElement.focus();
textAreaElement.value = "";
}

function handleCopy() {
  if (processingText) {
    writeOnClipboard(processingText, enablePermissionsCheck);
  } else {
    alert("Please type in text before copying");
    textAreaElement.focus()
  }
}

function handleReformatting(e) {
  e.preventDefault();
  
  let currentForm = e.target;
  
  let { originalText } = formElement.elements;
  
  let reformatted = rearranger(originalText?.value.trim());
  
  // set the reformatted text
  if (reformatted) resultElement.innerHTML = reformatted;
}