import React from 'react';
import { REVERSE_ID_TABLE } from '../utils/lookups';

export default function Wikify({ id, name, children }) {
  const slug = name || REVERSE_ID_TABLE[id];
  if (!slug) {
    return children;
  }
  return (
    <a
      target="blank"
      href={`https://stardewvalleywiki.com/${slug.replace(' ', '_')}`}
    >
      {children}
    </a>
  );
}
