import { Select, Spin } from 'antd';
import { useRef, useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';

const { Option } = Select;

export default function StardewSearch() {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const searchRef = useRef(null);
  useEffect(() => {
    const listener = e => {
      if (e.code === 'KeyF' && !searchRef.current.rcSelect._focused) {
        setTimeout(() => searchRef.current.focus(), 50);
      }
    };
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);

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
      ref={searchRef}
      showAction={['focus', 'click']}
      value={value}
      onSearch={value => {
        setValue(value);
        fetchSearchResults(value);
      }}
      placeholder="Search stardewwiki"
      notFoundContent={fetching ? <Spin size="small" /> : null}
      filterOption={false}
      showSearch
      defaultActiveFirstOption={false}
      showArrow={false}
      style={{ width: '100%' }}
      onChange={value => {
        window.open(value, '_blank');
      }}
    >
      {data.map(d => (
        <Option key={d.value}>{d.text}</Option>
      ))}
    </Select>
  );
}
