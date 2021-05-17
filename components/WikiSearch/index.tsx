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
import { Link, Pane, Popover, SearchInput } from 'evergreen-ui';
import { useParsedGame } from 'hooks/useParsedGame';
import useHotkeyToFocus from 'hooks/useHotkeyToFocus';

export default function WikiSearch() {
  const [inputValue, setInputValue] = useState('');
  const [focusedResult, setFocusedResult] = useState(0);
  const searchIndex = useSearch();
  const { parsedGame } = useParsedGame();
  const getSuggestions = useCallback(
    (query) => {
      if (query && query.trim().length === 0) return [];
      const suggestions = searchIndex.search(query.trim(), {
        limit: 3,
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
      >
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
    );
  }, [suggestions, focusedResult, parsedGame]);

  const onChange = useCallback((e) => {
    setInputValue(e.target.value);
  }, []);

  const onKeyPress = useCallback(
    (e) => {
      console.log('pressed');
      switch (e.key) {
        case 'ArrowUp': {
          setFocusedResult((prev) => {
            return Math.max(prev - 1, 0);
          });
          e.preventDefault();
          break;
        }
        case 'ArrowDown': {
          console.log('ummm');
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
          e.preventDefault();
          break;
        }
        default: {
          break;
        }
      }
    },
    [setFocusedResult, suggestions, focusedResult]
  );
  const searchRef = useRef<any>();
  useHotkeyToFocus(searchRef, ['s']);
  useEffect(() => {
    setFocusedResult(0);
  }, [suggestions]);

  return (
    <Popover
      content={searchResults || []}
      isShown={suggestions.length > 0 || true}
      minWidth="30%"
      position="bottom"
    >
      <Pane width="100%">
        <SearchInput
          placeholder="search wiki"
          width="100%"
          value={inputValue}
          onBlur={() => {
            // setInputValue('');
          }}
          onChange={onChange}
          onKeyDown={onKeyPress}
          ref={searchRef}
          style={{
            fontSize: '1rem',
          }}
        />
      </Pane>
    </Popover>
  );
}
