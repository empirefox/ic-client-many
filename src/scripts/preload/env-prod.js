if (window.location.protocol === 'http:') {
  window.location.assign(window.location.href.replace(/^http\:\/\//, 'https://'));
}
