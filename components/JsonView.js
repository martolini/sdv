import dynamic from 'next/dynamic';

export default dynamic(() => import('react-json-view'), {
  ssr: false,
});
