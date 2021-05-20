import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useSearch from './useSearch';
import { useDebounce } from 'use-debounce';
import Suggestion from './Suggestion';
import { Pane, Popover, SearchInput } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import useHotkeyToFocus from 'hooks/useHotkeyToFocus';

export default function WikiSearch() {
  const [inputValue, setInputValue] = useState('');
  const [focusedResult, setFocusedResult] = useState(0);
  const searchIndex = useSearch();
  const { parsedGame } = useParsedGame();
  const searchRef = useRef<any>();
  const getSuggestions = useCallback(
    (query) => {
      if (query && query.trim().length === 0) return [];
      const suggestions = searchIndex.search(query.trim(), {
        limit: 8,
      });
      return suggestions;
    },
    [searchIndex]
  );

  const [debouncedInput] = useDebounce(inputValue, 100);
  const suggestions = useMemo(() => getSuggestions(debouncedInput), [
    debouncedInput,
  ]);
  const searchResults = useMemo(() => {
    if (suggestions.length === 0) return null;
    return (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
        }}
        onClick={(e) => {
          e.preventDefault();
          const { item: { href = null } = {} } =
            suggestions[focusedResult] || {};
          if (href) {
            window.open(`https://stardewvalleywiki.com${href}`, '_blank');
          }
          searchRef.current.focus();
        }}
      >
        {suggestions.map((sugg, i) => (
          <li key={sugg.refIndex}>
            <Suggestion
              key={sugg.refIndex}
              item={sugg.item}
              focused={focusedResult === i}
              onFocused={() => setFocusedResult(i)}
            />
          </li>
        ))}
      </ul>
    );
  }, [suggestions, focusedResult, parsedGame, searchRef]);

  const onChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const onKeyPress = useCallback(
    (e) => {
      switch (e.key) {
        case 'ArrowUp': {
          setFocusedResult((prev) => {
            return Math.max(prev - 1, 0);
          });
          e.preventDefault();
          break;
        }
        case 'ArrowDown': {
          setFocusedResult((prev) => {
            return Math.min(prev + 1, suggestions.length - 1);
          });
          e.preventDefault();
          break;
        }
        case 'Enter': {
          const { item: { href = null } = {} } =
            suggestions[focusedResult] || {};
          if (href) {
            window.open(`https://stardewvalleywiki.com${href}`, '_blank');
          }
          break;
        }
        default: {
          break;
        }
      }
    },
    [setFocusedResult, suggestions, focusedResult]
  );
  useEffect(() => {
    setFocusedResult(0);
  }, [suggestions]);
  useHotkeyToFocus(searchRef, ['s']);

  return (
    <Popover
      content={searchResults || []}
      isShown={suggestions.length > 0}
      minWidth="40%"
      position="bottom"
    >
      <Pane width="100%">
        <SearchInput
          placeholder="search wiki"
          width="100%"
          onKeyDown={onKeyPress}
          value={inputValue}
          onBlur={() => {
            setInputValue('');
          }}
          onChange={onChange}
          ref={searchRef}
          style={{
            fontSize: '1rem',
          }}
        />
      </Pane>
    </Popover>
  );
}
