import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import axios from 'axios';
import { Autocomplete, TextInput } from 'evergreen-ui';

export default function WikiSearch() {
  const [fetching, setFetching] = useState(false);
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const fetchSearchResults = useCallback(
    debounce(async (q) => {
      setFetching(true);
      try {
        const response = await axios.get(`/api/wikisearch`, { params: { q } });
        console.log(response);
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
    <Autocomplete
      onStateChange={console.log}
      onUserAction={console.log}
      onChange={() => {
        console.log('changed');
      }}
      items={['1', '2', '3']}
      title="Search"
    >
      {(props) => {
        const { getInputProps, getRef, inputValue, openMenu } = props;
        console.log(inputValue);
        return (
          <TextInput
            id="wiki-search-input"
            width="80%"
            onChange={() => {
              console.log('asdasd');
            }}
            marginLeft="10%"
            marginRight="10%"
            placeholder="Search"
            value={inputValue}
            ref={getRef}
            {...getInputProps({
              onFocus: () => {
                openMenu();
              },
            })}
          />
        );
      }}
    </Autocomplete>
  );
}
