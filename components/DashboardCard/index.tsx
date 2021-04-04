import { Card, CardProps } from 'evergreen-ui';

type DashboardCardProps = {};

const DashboardCard: React.FC<DashboardCardProps & CardProps> = ({
  children,
  ...props
}) => {
  return (
    <Card
      display="flex"
      backgroundColor="white"
      elevation={2}
      padding={16}
      borderRadius={15}
      margin={8}
      alignItems="flex-start"
      justifyContent="center"
      {...props}
    >
      {children}
    </Card>
  );
};

export default DashboardCard;
