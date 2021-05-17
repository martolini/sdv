import { useEffect, MutableRefObject } from 'react';

export default function useHotkeyToFocus<T extends MutableRefObject<any>>(
  inputRef: T,
  keys: string[]
): T {
  useEffect(() => {
    const keyHandler = (e) => {
      if (
        keys.includes(e.key) &&
        document.activeElement.nodeName !== 'INPUT' &&
        document.activeElement.attributes['role'].nodeValue !== 'textbox'
      ) {
        inputRef.current.focus();
      }
      // If escape key is hit and the input field is focused
      if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current.blur();
      }
    };
    window.addEventListener('keyup', keyHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keyup', keyHandler);
    };
  }, [inputRef, keys, document]);
  return inputRef;
}
