async function writeOnClipboard(text, enablePermissionsCheck) {
  
  let permissionsGranted = await clipboardPermissionsGranted()
  
  // grant permissions on permissions checking not enabled
  if (permissionsGranted || !enablePermissionsCheck) {
    if (document.hasFocus()) {
      try {
        await navigator.clipboard.writeText(text);
        alert('Content copied');
        
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  }
}

async function readFromClipboard(enablePermissionsCheck) {
  
  let permissionsGranted = await clipboardPermissionsGranted()
  
  // grant permissions on permissions checking not enabled
  if (permissionsGranted || !enablePermissionsCheck) {
    try {
      const clipboardText = await navigator.clipboard.readText();
      return clipboardText;
    } catch (err) {
      console.error('Failed to paste: ', err);
    }
  }
}

async function clipboardPermissionsGranted() {
  
  const writePermission = await navigator.permissions.query({ name: "clipboard-write" }).then(result => result.state);
  
  const readPermission = await navigator.permissions.query({ name: "clipboard-read" }).then(result => result.state);
  
  return writePermission === "granted" && readPermission !== "denied";
}

export { writeOnClipboard, readFromClipboard };