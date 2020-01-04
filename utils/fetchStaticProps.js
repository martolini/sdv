import absoluteUrl from './absoluteUrl';
import fetch from 'isomorphic-unfetch';

const getInitialProps = ({ path, propsKey }) => async context => {
  const { id } = context.ctx.query;
  if (!id) {
    return {};
  }
  const { origin } = absoluteUrl(context.ctx.req, 'localhost:3000');
  const result = await fetch(`${origin}/api/${path}/${id}`);
  const output = await result.json();
  return {
    [propsKey]: output,
  };
};

export default getInitialProps;
