import React, { useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import AsyncSelect from 'react-select/async';
import useHotkeyToFocus from 'hooks/useHotkeyToFocus';

export default function WikiSearch() {
  const loadOptions = useCallback(async (q) => {
    const response = await axios.get(`/api/wikisearch`, { params: { q } });
    return response.data.results.map((r) => ({
      value: r.value,
      label: r.text,
    }));
  }, []);

  const inputRef = useRef<any>();

  const hotkeys = useMemo(() => ['s'], []);
  useHotkeyToFocus(inputRef, hotkeys);

  return (
    <AsyncSelect
      id="wiki-search"
      instanceId="wiki-search"
      ref={inputRef}
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
