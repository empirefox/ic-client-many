window.HELP_IMPROVE_VIDEOJS = false;

function parseJSON(json) {
  try {
    return JSON.parse(json);
  } catch (e) {
    (trace || console.log)('Error parsing json: ' + json);
  }
  return null;
}
