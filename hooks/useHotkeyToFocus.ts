import { useEffect, MutableRefObject } from 'react';

export default function useHotkeyToFocus<T extends MutableRefObject<any>>(
  inputRef: T,
  keys: string[]
): T {
  useEffect(() => {
    const keyHandler = (e) => {
      if (keys.includes(e.key) && document.activeElement.nodeName !== 'INPUT') {
        inputRef.current.focus();
      }
      // If escape key is hit and the input field is focused
      // The inputRef.current.mounted is for the AsyncSelect thingy
      if (
        e.key === 'Escape' &&
        (document.activeElement === inputRef.current ||
          inputRef.current.mounted)
      ) {
        inputRef.current.blur();
      }
    };
    window.addEventListener('keyup', keyHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keyup', keyHandler);
    };
  }, [inputRef, keys]);
  return inputRef;
}