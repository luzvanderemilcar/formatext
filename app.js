import rearranger from '/rearranger.js';
import writeOnClipboard from '/clipboard.js';

let processingText = "";

// disable permissions for clipboard
let enablePermissionsCheck = false;

let formElement = document.getElementById("reformation");
let textAreaElement = document.getElementById("original-text");

let resultElement = document.getElementById("result");
let copyButton = document.getElementById("copy-clipboard");

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

function handleCopy () {
    if (processingText) {
    writeOnClipboard(processingText, enablePermissionsCheck);
  } else {
    alert("Please type in text before copying");
    textAreaElement.focus()
  }
}

function handleReformation(e) {
e.preventDefault();

let currentForm = e.target;

let { originalText} = formElement.elements;

let reformatted = rearranger(originalText?.value.trim());

// set the reformatted text
if (reformatted) resultElement.innerHTML = reformatted;
}