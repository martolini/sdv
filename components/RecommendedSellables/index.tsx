import CardTitle from 'components/CardTitle';
import DashboardCard from 'components/DashboardCard';
import { Paragraph, Pane } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import { useMemo } from 'react';
import { calculateRecommendedSellables } from './utils';

const RecommendedSellables: React.FC = () => {
  const { parsedGame } = useParsedGame();
  const recommended = useMemo(() => calculateRecommendedSellables(parsedGame), [
    parsedGame,
  ]);
  return (
    <DashboardCard>
      <CardTitle>Recommended sellables</CardTitle>
      <Pane marginTop={10}>
        {recommended.slice(0, 8).map((item) => (
          <Paragraph
            fontSize="1.2rem"
            letterSpacing="0.8px"
            key={item.key}
            marginBottom={10}
          >
            {item.name} x {item.stack}:
            <span style={{ float: 'right' }}>${item.price}</span>
          </Paragraph>
        ))}
      </Pane>
    </DashboardCard>
  );
};

export default RecommendedSellables;
