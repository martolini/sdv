import React from 'react';
import { REVERSE_ID_TABLE } from '../utils/lookups';
import ExternalLink from './ExternalLink';

export default function Wikify({ id, name, children }) {
  const slug = name || REVERSE_ID_TABLE[id];
  if (!slug) {
    return children;
  }
  return (
    <ExternalLink
      href={`https://stardewvalleywiki.com/${slug.replace(' ', '_')}`}
    >
      {children}
    </ExternalLink>
  );
}
