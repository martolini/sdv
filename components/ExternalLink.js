import React from 'react';

export default ({ href, children, ...rest }) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
    {children}
  </a>
);
