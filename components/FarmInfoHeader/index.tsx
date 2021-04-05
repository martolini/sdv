import { Pane, Paragraph, Text, Tooltip, useTheme } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import CardTitle from 'components/CardTitle';
import NPC_ITEM_LIKES from 'utils/npclikes';
import { sellingQuantifier } from 'utils/stardew-helpers';
import { Item } from 'typings/stardew';
import { useMemo } from 'react';
import { BiLike } from '@react-icons/all-files/bi/BiLike';
import { AiOutlineHeart } from '@react-icons/all-files/ai/AiOutlineHeart';

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const getPrice = (item: Item) =>
  item.basePrice * sellingQuantifier(item.quality);

export default function FarmInfoHeader() {
  const { parsedGame } = useParsedGame();
  const { gameInfo, todaysBirthday } = parsedGame;
  const theme = useTheme();
  const recommendedGifts = useMemo(() => {
    if (!todaysBirthday) return;
    const likes = NPC_ITEM_LIKES[todaysBirthday.name];
    const recommendedGifts = parsedGame.items
      .filter(
        (i) =>
          !!likes.find(
            (li) => li.itemId === i.itemId || li.itemId === i.category
          )
      )
      .sort((a, b) => getPrice(a) - getPrice(b))
      .slice(0, 3)
      .map((i) => ({ ...i, type: likes.find((i2) => i2.itemId).type }));
    return recommendedGifts;
  }, [todaysBirthday]);

  return (
    <Pane
      width="100%"
      backgroundColor="white"
      border
      padding={8}
      marginBottom={8}
      borderRadius={10}
      flexDirection="row"
      display="flex"
      alignItems="center"
      justifyContent="space-around"
    >
      <CardTitle>{gameInfo.farmName}</CardTitle>
      <Text fontSize="1.2rem" color={theme.colors.text.info}>
        {DAYS[(gameInfo.dayOfMonth - 1) % 7]} {gameInfo.dayOfMonth}{' '}
        {gameInfo.currentSeason}, YEAR {gameInfo.year}
      </Text>
      <Text color={theme.colors.text.success} fontSize="1.2rem">
        {gameInfo.dailyLuck}% luck
      </Text>
      {todaysBirthday && (
        <Tooltip
          content={
            <Pane>
              <Paragraph
                color="white"
                fontSize="1.2rem"
                textDecoration="underline"
              >
                GIFT TIPS:
              </Paragraph>
              {recommendedGifts.map((item) => (
                <Pane>
                  <Paragraph key={item.itemId} color="white" fontSize="1.2rem">
                    {item.name} ({item.stack}){' '}
                    {item.type === 'like' && <BiLike />}
                    {item.type === 'love' && <AiOutlineHeart />}
                  </Paragraph>
                </Pane>
              ))}
            </Pane>
          }
        >
          <Text color={theme.colors.text.selected} fontSize="1.2rem">
            Birthday today: <span>{todaysBirthday.name}</span>
          </Text>
        </Tooltip>
      )}
    </Pane>
  );
}
