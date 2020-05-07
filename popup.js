'use strict';
console.log('loaded-popup')
chrome.runtime.sendMessage({type: 'requestCreateSession', data: {}})
window.setTimeout(window.close, 500);
