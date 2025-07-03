
import { replaceProcessingInstructions } from '../parseXML.common.js';
// parseXML.browser.js
export function parseXML(xmlString) {
  const parser = new DOMParser();
  const preprocessed = replaceProcessingInstructions(xmlString)
  return parser.parseFromString(preprocessed, "application/xml");
}