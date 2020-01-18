/* eslint-disable no-underscore-dangle */
import { List, Icon, Tabs, Badge } from 'antd';

const { TabPane } = Tabs;

const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

export default function QuestList(props) {
  const { notifications = {} } = props;
  if (Object.keys(notifications).length === 0) {
    return null;
  }

  return (
    <div style={{ maxWidth: 400 }}>
      <Tabs>
        {Object.keys(notifications).map(name => {
          const quests = notifications[name];
          return (
            <TabPane
              tab={
                <>
                  <span style={{ marginRight: 10 }}>{name}</span>
                  <Badge count={quests.length} />
                </>
              }
              key={name}
            >
              <List
                itemLayout="vertical"
                size="large"
                pagination={false}
                dataSource={quests}
                renderItem={item => (
                  <List.Item
                    key={item.id}
                    actions={[
                      item.npcName && (
                        <IconText type="user" text={item.npcName} key="user" />
                      ),
                      item.locationOfItem && (
                        <IconText
                          type="location"
                          text={item.locationOfItem}
                          key="location"
                        />
                      ),
                      <IconText
                        type="dollar"
                        text={item.moneyReward}
                        key="list-dollar"
                      />,
                    ].filter(a => !!a)}
                  >
                    <List.Item.Meta
                      title={item.questTitle}
                      description={item._questDescription}
                    />
                    {item._currentObjective}
                  </List.Item>
                )}
              />
            </TabPane>
          );
        })}
      </Tabs>
    </div>
  );
}
