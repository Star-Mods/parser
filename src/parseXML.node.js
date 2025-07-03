import { DOMParser } from 'xmldom';
import { replaceProcessingInstructions } from '../parseXML.common.js';

export function parseXML(xmlString) {
  const parser = new DOMParser();
    const preprocessed = replaceProcessingInstructions(xmlString)
    return parser.parseFromString(preprocessed, "application/xml");
}