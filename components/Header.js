import { Layout, Tag } from 'antd';
import { useStoreState } from 'easy-peasy';
const { Header: AntHeader } = Layout;

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function Header(props) {
  const info = useStoreState(state => state.info);
  return (
    <AntHeader style={{ background: '#fff', padding: 0, paddingLeft: '15px' }}>
      <h2>
        {!info.farmName ? (
          'No farm uploaded.'
        ) : (
          <>
            {`${info.farmName} farm`}
            <Tag style={{ marginLeft: 25 }} color="orange">{`${
              info.currentSeason
            } ${info.dayOfMonth} ${DAYS[(info.dayOfMonth - 1) % 7]}`}</Tag>
            <Tag color="magenta">Year {info.year}</Tag>
            <Tag color="gold">
              {`${Math.round(((+info.dailyLuck + 0.1) / 0.2) * 100)}% luck`}
            </Tag>
            <Tag color="green">
              {info.money}
              <span role="img" aria-label="money">
                💰
              </span>
            </Tag>
          </>
        )}
      </h2>
    </AntHeader>
  );
}
