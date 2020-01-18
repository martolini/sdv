import { useStoreState } from 'easy-peasy';
import { Layout, Tag, Icon, Badge, Popover } from 'antd';
import styled from 'styled-components';
import QuestList from './QuestList';
import Wikify from './Wikify';
import StardewSearch from './StardewSearch';

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

const StyledHeader = styled(AntHeader)`
  display: flex;
  width: 100%;
  .notification-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: 2%;

    i {
      font-size: 24px;
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: #1890ff;
      }
    }
  }

  .search-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
    margin-right: 2%;
    width: 30%;
  }
`;

export default function Header() {
  const info = useStoreState(state => state.info);
  const players = useStoreState(state => state.players);

  const notifications = Object.keys(players).reduce((p, c) => {
    const acc = {
      ...p,
      [c]: players[c].questLog.Quest || [],
    };
    return acc;
  }, {});

  const randomNotificationCount =
    Object.values(notifications).reduce(
      (p, c) => (c.length > p ? c.length : p),
      0
    ) || 0;

  return (
    <StyledHeader
      style={{ background: '#fff', padding: 0, paddingLeft: '15px' }}
    >
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
                  {`${info.birthdays[0].name}'s birthday `}
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
      <div className="search-bar">
        <StardewSearch />
      </div>
      <div className="notification-icon">
        <Badge count={randomNotificationCount} style={{ fontSize: 18 }}>
          <Popover
            content={<QuestList notifications={notifications} />}
            trigger="click"
            placement="bottomLeft"
          >
            <Icon type="bell" />
          </Popover>
        </Badge>
      </div>
    </StyledHeader>
  );
}
