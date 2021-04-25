import React, { useCallback, useEffect, useRef } from 'react';
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

  const inputRef = useRef<any>();

  useEffect(() => {
    const keyHandler = (e) => {
      if (
        e.key === 's' &&
        document.activeElement !== inputRef.current &&
        document.activeElement.nodeName !== 'INPUT'
      ) {
        inputRef.current.focus();
      }
    };
    window.addEventListener('keyup', keyHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keyup', keyHandler);
    };
  }, [inputRef]);

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
