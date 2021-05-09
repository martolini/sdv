import { parseXml } from './parser';
import fs from 'fs';
import { groupBy } from 'lodash';

describe('Parser tests', () => {
  const file = fs.readFileSync('tests/fixtures/testdata.xml').toString();
  const parsed = parseXml(file);
  it('Can parse harvest and items', () => {
    expect(parsed.harvest).toHaveLength(262);
    expect(parsed.items).toHaveLength(351);
    expect(parsed.gameInfo.farmName).toBe('Tegrity');
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

  it('Can parse players', () => {
    const { players } = parsed;
    expect(players).toHaveLength(2);
    expect(players[0].name).toBe('Linnk');
    expect(players[1].name).toBe('Randy');
    expect(players[0].skills[0].percentageToNextLevel).toBe(24.3);
    expect(players[0].skills[0].professions).toHaveLength(1);
    expect(players[0].skills[0].professions[0].name).toBe('Rancher');
  });

  it('Can find birthdays', () => {
    const file = fs.readFileSync('tests/fixtures/birthday_test.xml').toString();
    const { todaysBirthday } = parseXml(file);
    expect(todaysBirthday.name).toBe('Alex');
  });

  it('Ensure all items has ids of some kind', () => {
    const { items } = parsed;
    expect(items.filter((item) => item.itemId === undefined)).toHaveLength(0);
  });

  it('Can parse maps and forages', () => {
    const { maps } = parsed;
    expect(maps.length).toBe(62);
    const first = maps[1];
    expect(first.name).toBe('Farm');
    expect(first.forage.length).toBe(22);
  });

  it('Can find trees', () => {
    const file = fs.readFileSync('tests/fixtures/trees_test.xml').toString();
    const { trees } = parseXml(file);
    const grouped = groupBy(
      trees.filter((t) => t.location === 'Farm'),
      (t) => t.treeType
    );
    expect(Object.keys(grouped).length).toBe(5);
  });
});
