export default async function copyContent(text) {
  let accessGiven = navigator.permissions.query({ name: "write-on-clipboard" }).then((result) => {
  if (result.state == "granted" || result.state == "prompt") return true;
  return false
});

if (accessGiven) {
  try {
    await navigator.clipboard.writeText(text);
    alert('Content copied');

  } catch (err) {
    console.error('Failed to copy: ', err);
  }
}
}