import Header from 'components/Header';
import { Pane } from 'evergreen-ui';

const SiteLayout: React.FC = ({ children }) => {
  return (
    <Pane padding={5}>
      <Header />
      {children}
    </Pane>
  );
};

export default SiteLayout;
