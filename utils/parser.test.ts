import { parseXml } from './parser';
import fs from 'fs';

describe('Parser tests', () => {
  it('works', () => {
    const file = fs.readFileSync('tests/fixtures/testdata.xml').toString();
    const parsed = parseXml(file);
    expect(parsed.harvest).toHaveLength(189);
    expect(parsed.items).toHaveLength(351);
    expect(parsed.gameInfo.farmName).toBe('Tegrity');
  });
});
