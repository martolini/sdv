import React, { useCallback, useEffect, useMemo, useState } from 'react';
import useSearch from './useSearch';
import { useDebounce } from 'use-debounce';
import Suggestion from './Suggestion';
import { Link, Pane, SearchInput } from 'evergreen-ui';
import { useHotkeys } from 'react-hotkeys-hook';

export default function WikiSearch() {
  const [inputValue, setInputValue] = useState('');
  const [focusedResult, setFocusedResult] = useState(0);
  const searchIndex = useSearch();
  const getSuggestions = useCallback(
    (query) => {
      if (query && query.trim().length === 0) return [];
      const suggestions = searchIndex.search(query.trim(), {
        limit: 10,
      });
      return suggestions;
    },
    [searchIndex]
  );

  const [debouncedInput] = useDebounce(inputValue, 100);
  const suggestions = useMemo(() => getSuggestions(debouncedInput), [
    debouncedInput,
  ]);
  const searchResults = useMemo(
    () => (
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {suggestions.map((sugg, i) => (
          <li key={sugg.refIndex}>
            <Link
              href={`https://stardewvalleywiki.com${sugg.item.href}`}
              target="_blank"
            >
              <Suggestion
                key={sugg.refIndex}
                item={sugg.item}
                focused={focusedResult === i}
                onFocused={() => setFocusedResult(i)}
              />
            </Link>
          </li>
        ))}
      </ul>
    ),
    [suggestions, focusedResult]
  );

  const onChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const onKeyPress = useCallback(
    (e) => {
      if (e.key === 'ArrowUp') {
        setFocusedResult((prev) => {
          return Math.max(prev - 1, 0);
        });
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        setFocusedResult((prev) => {
          return Math.min(prev + 1, suggestions.length - 1);
        });
        e.preventDefault();
      }
    },
    [setFocusedResult, suggestions]
  );

  useHotkeys('up,down', onKeyPress);
  useEffect(() => {
    setFocusedResult(0);
  }, [suggestions]);

  return (
    <Pane width="100%">
      <SearchInput
        placeholder="search wiki"
        width="100%"
        value={inputValue}
        onChange={onChange}
        onKeyDown={onKeyPress}
      />
      <Pane marginTop="10px">{searchResults}</Pane>
    </Pane>
  );
}
