import FileUploader from './index';

export default {
  title: 'FileUploader',
};

export const Basic = () => (
  <FileUploader
    onFinished={(game) => {
      console.log(game);
    }}
  />
);
export const Small = () => (
  <FileUploader
    small
    onFinished={(game) => {
      console.log(game);
    }}
  />
);
