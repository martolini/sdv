import { Card, CardProps } from 'evergreen-ui';

type DashboardCardProps = {};

const DashboardCard: React.FC<DashboardCardProps & CardProps> = ({
  children,
  width = '30%',
}) => {
  return (
    <Card
      display="flex"
      maxWidth="40%"
      backgroundColor="white"
      elevation={2}
      padding={16}
      borderRadius={15}
      margin={8}
      width={width}
      alignItems="flex-start"
      justifyContent="center"
    >
      {children}
    </Card>
  );
};

export default DashboardCard;
