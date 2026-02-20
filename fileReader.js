/**
 * @param {File} file file imported whose content is to be read
 * @param {Function} callbackProcess function that process the content ultimatly
 * @param {string} directive optional value to specify the action that is wanted when processing the content. It takes three values: "asText" (default), "asDataUrl" and "asArrayBuffer".
 * @return {undefined}
 */
function readFile(file, callbackProcess, directive = "asText") {
  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;

    // processing the result 
     callbackProcess(content);
  };
  
  // switching directives on how to process the data
  switch (directive) {
    case 'asText':
      reader.readAsText(file);
      break;
    case 'asDataUrl':
      // Tab to edit
      break;
    case 'asArrayBuffer':
      // Tab to edit
      break;
      
    default:
      reader.readAsText(file);
  }
}


export {readFile};