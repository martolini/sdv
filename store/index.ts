import { createContext } from 'react';
import { ParsedGame } from 'utils/parser';

export default createContext<ParsedGame | null>(null);
