import { Paragraph } from 'evergreen-ui';

const CardTitle: React.FC = (props) => (
  <Paragraph fontSize="1.4rem" letterSpacing=".8px" marginY={8}>
    {props.children}
  </Paragraph>
);

export default CardTitle;
