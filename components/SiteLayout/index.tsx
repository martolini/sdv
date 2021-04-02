import Header from 'components/Header';
import { Pane } from 'evergreen-ui';

const SiteLayout: React.FC = ({ children }) => {
  return (
    <Pane padding={5}>
      <Header />
      <Pane marginX={16} marginY={24}>
        {children}
      </Pane>
    </Pane>
  );
};

export default SiteLayout;
