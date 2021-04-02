import React, { useCallback } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';

export default function WikiSearch() {
  const loadOptions = useCallback(async (q) => {
    const response = await axios.get(`/api/wikisearch`, { params: { q } });
    return response.data.results.map((r) => ({
      value: r.value,
      label: r.text,
    }));
  }, []);

  return (
    <AsyncSelect
      id="wiki-search"
      instanceId="wiki-search"
      loadOptions={loadOptions}
      styles={{
        option: (styles) => ({ ...styles, fontFamily: 'VT323', fontSize: 14 }),
        control: (styles) => ({ ...styles, fontFamily: 'VT323', fontSize: 14 }),
      }}
      onChange={({ value }) => window.open(value, '_blank')}
      placeholder="Search stardew wiki"
    />
  );
}
