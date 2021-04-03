import { Card, CardProps } from 'evergreen-ui';

type DashboardCardProps = {
  width?: string | number;
  cardProps?: CardProps;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  width = '30%',
  cardProps = {},
}) => {
  return (
    <Card
      backgroundColor="white"
      elevation={2}
      padding={16}
      borderRadius={15}
      margin={8}
      width={width}
      alignItems="center"
      justifyContent="center"
      {...cardProps}
    >
      {children}
    </Card>
  );
};

export default DashboardCard;
