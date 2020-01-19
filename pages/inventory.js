import React, { useState } from 'react';
import { groupBy, uniqBy, debounce, uniq } from 'lodash';
import { Table, Input, Icon } from 'antd';
import { useStoreState } from 'easy-peasy';
import QualityIcon from '../components/QualityIcon';
import TableWrapper from '../components/TableWrapper';
import Wikify from '../components/Wikify';

const { Search } = Input;

export default function InventoryView() {
  const [searchTerm, setSearchTerm] = useState();
  const debouncedSetSearchTerm = debounce(setSearchTerm, 100);
  const itemsMap = useStoreState(state => state.deliverableItems);
  const itemsArray = Object.keys(itemsMap).reduce(
    (p, c) => [...p, ...itemsMap[c]],
    []
  );
  const itemsByQuality = groupBy(
    itemsArray,
    item => `${item.id}_${item.quality}`
  );
  const dataSource = Object.values(itemsByQuality).reduce(
    (p, c) => [
      ...p,
      c.length === 0
        ? undefined
        : {
            ...c[0],
            stack: c.reduce((prev, cur) => prev + cur.stack, 0),
            chestColors: uniq(
              c.reduce((prev, cur) => [...prev, cur.chestColor], [])
            ),
          },
    ],
    []
  );
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      width: '10%',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Name',
      render: row => (
        <Wikify name={row.name} id={row.id}>
          {row.name}{' '}
          <QualityIcon style={{ float: 'right' }} quality={row.quality} />
        </Wikify>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Quantity',
      dataIndex: 'stack',
      sorter: (a, b) => a.stack - b.stack,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => +a.price - +b.price,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: uniqBy(dataSource, item => item.type)
        .map(item => item.type)
        .sort((a, b) => a.localeCompare(b))
        .filter(t => t)
        .map(t => ({ text: t, value: t })),
      onFilter: (value, record) => record.type === value,
    },
    {
      title: 'Chest color',
      width: '20%',
      render: record => (
        <div>
          {record.chestColors.map((color, i) => (
            <Icon
              type="wallet"
              // eslint-disable-next-line react/no-array-index-key
              key={`${color}_${i}`}
              theme="filled"
              style={{
                fontSize: 24,
                color: `#${color}`,
                border: '1px solid grey',
                marginRight: 5,
              }}
            />
          ))}
        </div>
      ),
    },
  ];

  const searchRegexp = new RegExp(searchTerm, 'i');
  const filteredData = dataSource.filter(row => searchRegexp.test(row.name));

  return (
    <div>
      <Search
        width="100%"
        size="large"
        style={{ marginBottom: '10px' }}
        placeholder="Press enter to search"
        onChange={e => {
          debouncedSetSearchTerm(e.target.value);
        }}
        onSearch={value => {
          setSearchTerm(value);
        }}
      />
      <TableWrapper style={{ overflowX: 'scroll' }}>
        <Table
          rowKey={row => `${row.id}_${row.quality}`}
          dataSource={filteredData}
          columns={columns}
        />
      </TableWrapper>
    </div>
  );
}
