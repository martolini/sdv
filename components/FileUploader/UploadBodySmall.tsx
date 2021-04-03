import { CloudUploadIcon, Paragraph } from 'evergreen-ui';
import React from 'react';

const UploadBodySmall = () => (
  <React.Fragment>
    <Paragraph fontSize="0.9rem" fontFamily="mono" letterSpacing={0.6}>
      Upload file
    </Paragraph>
    <CloudUploadIcon size={20} color="info" alignSelf="center" />
  </React.Fragment>
);

export default UploadBodySmall;
