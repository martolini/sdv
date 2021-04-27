import React, { useCallback, useMemo, useRef, useState } from 'react';
import useHotkeyToFocus from 'hooks/useHotkeyToFocus';
import Autosuggest from 'react-autosuggest';
import theme from './theme.module.css';
import Avatar from 'react-avatar';
import { GiLockedChest } from '@react-icons/all-files/gi/GiLockedChest';
import useSearch, { SearchEntry } from './useSearch';
import { StarIcon } from 'evergreen-ui';
import { qualityToColor } from 'utils/stardew-helpers';
import { useDebouncedCallback } from 'use-debounce';

const getSuggestionValue = (value) => value.item.name;

export default function WikiSearch() {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const onChange = useCallback((e, { newValue }) => {
    setInputValue(newValue);
  }, []);

  const searchIndex = useSearch();
  const getSuggestions = useCallback(
    (query) => {
      if (query.trim().length === 0) return [];
      const suggestions = searchIndex.search(query.trim(), {
        limit: 10,
      });
      return suggestions;
    },
    [searchIndex]
  );

  const onSuggestionsFetchRequested = useDebouncedCallback(
    useCallback(
      ({ value }) => {
        setSuggestions(getSuggestions(value));
      },
      [setSuggestions, getSuggestions]
    ),
    100
  );

  const inputRef = useRef<any>();

  const hotkeys = useMemo(() => ['s'], []);
  useHotkeyToFocus(inputRef, hotkeys);

  const onSuggestionsClearRequested = useCallback(() => {
    setInputValue('');
  }, []);

  const renderSuggestion = useCallback(({ item }: { item: SearchEntry }) => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          {item.name}
          {item.stack && ` x ${item.stack}`}
        </div>
        <div>
          {item.qualities?.length
            ? item.qualities.map((quality) => (
                <StarIcon key={quality} color={qualityToColor(quality)} />
              ))
            : null}
        </div>
        <div>
          {item.chests?.length
            ? item.chests.map((color) => (
                <GiLockedChest key={color} color={color} />
              ))
            : null}
        </div>
        <div>
          {item.players?.length
            ? item.players.map((player) => (
                <Avatar
                  key={player}
                  name={player}
                  size="1.4rem"
                  round
                  textSizeRatio={2.5}
                />
              ))
            : null}
        </div>
      </div>
    );
  }, []);

  const onSuggestionSelected = useCallback((_, { suggestion }) => {
    const { href } = suggestion.item;
    window.open(`https://stardewvalleywiki.com${href}`, '_blank');
  }, []);

  const inputProps = useMemo(
    () => ({
      placeholder: 'search wiki',
      value: inputValue,
      onChange,
      ref: inputRef,
    }),
    [inputValue, onChange]
  );

  return (
    <Autosuggest
      suggestions={suggestions}
      highlightFirstSuggestion
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      theme={theme}
    />
  );
}
