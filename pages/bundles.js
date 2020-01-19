import React from 'react';
import { Tag, Table, Empty } from 'antd';
import styled from 'styled-components';
import { uniqBy } from 'lodash';
import { useStoreState } from 'easy-peasy';
import Wikify from '../components/Wikify';
import QualityIcon from '../components/QualityIcon';

const WrapperDiv = styled.div`
  .green-row {
    background-color: #21af2159;
  }

  .ant-table-tbody > tr > td {
    padding: 12px 12px;
  }
`;

export default function BundleView() {
  const missingBundleItems = useStoreState(state => state.missingBundleItems);
  if (missingBundleItems.length === 0) {
    return <Empty />;
  }

  const columns = [
    {
      title: 'Room',
      dataIndex: 'roomName',
      sorter: (a, b) => a.roomName.localeCompare(b.roomName),
      // eslint-disable-next-line react/display-name
      render: name => <Wikify name={`Bundle#${name}`}>{name}</Wikify>,
    },
    {
      title: 'Bundle',
      dataIndex: 'bundleName',
    },
    {
      title: 'Reward',
      dataIndex: 'reward',
      render: reward => (
        <div>
          <Wikify name={reward.name}>
            {reward.name} ({reward.stack})
          </Wikify>
        </div>
      ),
    },
    {
      title: 'nMissing',
      dataIndex: 'nMissing',
      sorter: (a, b) => a.nMissing - b.nMissing,
    },
    {
      title: 'Missing',
      dataIndex: 'missingIngredients',
      render: (_, bundle) => (
        <div>
          {bundle.missingIngredients
            .filter(i => i.name)
            .map((ing, i) => (
              <Tag
                // eslint-disable-next-line react/no-array-index-key
                key={`${ing.itemId}_${ing.quality}_${i}`}
                color={ing.deliverable ? 'green' : 'red'}
              >
                <Wikify name={ing.name}>
                  {ing.name} ({ing.stack})
                </Wikify>
                <QualityIcon quality={ing.quality} />
              </Tag>
            ))}
        </div>
      ),
      filters: uniqBy(
        missingBundleItems
          .reduce((p, c) => [...p, ...c.missingIngredients], [])
          .map(ing => ({ text: ing.name, value: ing.itemId })),
        'value'
      )
        .filter(i => !!i.text)
        .sort((a, b) => a.text.localeCompare(b.text)),
      onFilter: (value, record) =>
        record.missingIngredients.find(i => i.itemId === value),
    },
  ];

  return (
    <WrapperDiv>
      <Table
        dataSource={missingBundleItems}
        rowKey="id"
        columns={columns}
        pagination={false}
        rowClassName={record => {
          const { nMissing, missingIngredients } = record;
          if (
            missingIngredients.reduce(
              (p, c) => p + (c.deliverable ? 1 : 0),
              0
            ) >= nMissing
          ) {
            return 'green-row';
          }
          return '';
        }}
      />
    </WrapperDiv>
  );
}
