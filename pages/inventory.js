import React, { useState } from 'react';
import { groupBy, uniqBy } from 'lodash';
import { Table, Input } from 'antd';
import QualityIcon from '../components/QualityIcon';
import TableWrapper from '../components/TableWrapper';
import Wikify from '../components/Wikify';

const { Search } = Input;

export default function InventoryView(props) {
  const [searchTerm, setSearchTerm] = useState();
  const { deliverableItems: itemsMap = {} } = props;
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
        : { ...c[0], stack: c.reduce((prev, cur) => prev + cur.stack, 0) },
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
        <Wikify {...row}>
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
        onSearch={value => {
          setSearchTerm(value);
        }}
      />
      <TableWrapper>
        <Table
          rowKey={row => `${row.id}_${row.quality}`}
          dataSource={filteredData}
          columns={columns}
          pagination={false}
        />
      </TableWrapper>
    </div>
  );
}
