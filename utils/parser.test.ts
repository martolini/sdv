import { parseXml } from './parser';
import fs from 'fs';

describe('Parser tests', () => {
  const file = fs.readFileSync('tests/fixtures/testdata.xml').toString();
  const parsed = parseXml(file);
  it('Can parse harvest and items', () => {
    expect(parsed.harvest).toHaveLength(189);
    expect(parsed.items).toHaveLength(351);
    expect(parsed.gameInfo.farmName).toBe('Tegrity');
    const { missingIngredients, roomName } = parsed.bundleInfo[
      parsed.bundleInfo.length - 3
    ];
    expect(roomName).toBe('Bulletin Board');
    expect(missingIngredients[0].itemId).toBe(444);
    expect(missingIngredients[0].deliverableInBundle).toBe(true);
    expect(missingIngredients[1].itemId).toBe(266);
    expect(missingIngredients[1].deliverableInBundle).toBe(false);
  });
  it('Can parse Bundles', () => {
    const {
      missingIngredients,
      roomName,
      nMissing,
      bundleName,
    } = parsed.bundleInfo[parsed.bundleInfo.length - 3];
    expect(roomName).toBe('Bulletin Board');
    expect(bundleName).toBe('Dye');
    expect(nMissing).toBe(2);
    expect(missingIngredients[0].itemId).toBe(444);
    expect(missingIngredients[0].deliverableInBundle).toBe(true);
    expect(missingIngredients[1].itemId).toBe(266);
    expect(missingIngredients[1].deliverableInBundle).toBe(false);
  });
});
