import fs from 'fs';
import path from 'path';
import { parseXML } from '../src/parseXML.node.js';

describe('parseXML utility', () => {
    const sampleXmlPath = path.resolve('test', './unitdata.test.xml');
    const sampleXml = fs.readFileSync(sampleXmlPath, 'utf-8');

    test('parses XML string into a document', () => {
        const doc = parseXML(sampleXml);
        expect(doc).toBeDefined();
        expect(typeof doc.getElementsByTagName).toBe('function');
    });

    test('parses units correctly', () => {
        const doc = parseXML(sampleXml);
        const units = doc.getElementsByTagName('CUnit');
        expect(units.length).toBe(627);

        const unitsArray = Array.from(units);
        const marineUnit = unitsArray.find(unit => unit.getAttribute('id') === 'Marine');
        expect(marineUnit.getElementsByTagName('LifeStart')[0].getAttribute('value')).toBe('45');
    });
});
