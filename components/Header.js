import { Icon, Layout, Tag } from 'antd';
import { useStoreState } from 'easy-peasy';
import Wikify from './Wikify';
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
            {info.birthdays.length > 0 && (
              <Wikify name={info.birthdays[0].name}>
                <Tag color="blue" style={{ cursor: 'pointer' }}>
                  {info.birthdays[0].name}'s birthday{' '}
                  <Icon
                    theme="twoTone"
                    type="carry-out"
                    twoToneColor="#eb2f96"
                  />
                </Tag>
              </Wikify>
            )}
          </>
        )}
      </h2>
    </AntHeader>
  );
}
