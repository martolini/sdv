import { Select, Spin } from 'antd';
import { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';

const { Option } = Select;

export default function StardewSearch() {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const fetchSearchResults = useCallback(
    debounce(async q => {
      setFetching(true);
      try {
        const response = await axios.get(`/api/wikisearch`, { params: { q } });
        setData(response.data.results);
      } catch (err) {
        setData([]);
        console.error(err);
      } finally {
        setFetching(false);
      }
    }, 200),
    []
  );

  return (
    <Select
      showAction={['focus', 'click']}
      value={value}
      onSearch={val => {
        setValue(val);
        fetchSearchResults(val);
      }}
      placeholder="Search stardewwiki"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      showSearch
      defaultActiveFirstOption={false}
      showArrow={false}
      style={{ width: '100%' }}
      onChange={val => {
        window.open(val, '_blank');
      }}
    >
      {data.map(d => (
        <Option key={d.value}>{d.text}</Option>
      ))}
    </Select>
  );
}
