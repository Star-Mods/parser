// parseXML.js (main entry)
let parseXML;

if (typeof window !== "undefined" && window.DOMParser) {
  // Browser
  parseXML = (await import('./parseXML.browser.js')).parseXML;
} else {
  // Node.js
  parseXML = (await import('./parseXML.node.js')).parseXML;
}

export { parseXML };