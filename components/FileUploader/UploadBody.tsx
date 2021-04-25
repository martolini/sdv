import {
  ClipboardIcon,
  CloudUploadIcon,
  Paragraph,
  toaster,
} from 'evergreen-ui';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const UploadBody = () => (
  <React.Fragment>
    <CloudUploadIcon size={40} color="info" alignSelf="center" />
    <Paragraph fontSize="1.5rem" fontFamily="mono" letterSpacing={0.6}>
      Drag and drop a save file to this area to upload
    </Paragraph>
    <Paragraph fontSize="1" fontFamily="mono" letterSpacing={0.6}>
      The save file (e.g. named Player_123456789) is located under:
    </Paragraph>
    <Paragraph fontSize="1" fontFamily="mono" letterSpacing={0.6}>
      <>
        <span>Windows: %AppData%\StardewValley\Saves\</span>
        <CopyToClipboard
          text="%AppData%\StardewValley\Saves\"
          onCopy={() => {
            toaster.success('Copied %AppData%StardewValleySaves to clipboard');
          }}
        >
          <ClipboardIcon
            marginLeft="10px"
            onClick={(e) => e.stopPropagation()}
            cursor="pointer"
            color="success"
          />
        </CopyToClipboard>
      </>
    </Paragraph>
    <Paragraph fontSize="1" fontFamily="mono" letterSpacing={0.6}>
      <>
        <span>Mac OSX & Linux: ~/.config/StardewValley/Saves/</span>
        <CopyToClipboard
          text="~/.config/StardewValley/Saves/"
          onCopy={() => {
            toaster.success(
              'Copied ~/.config/StardewValley/Saves/ to clipboard',
              {}
            );
          }}
        >
          <ClipboardIcon
            marginLeft="10px"
            onClick={(e) => e.stopPropagation()}
            cursor="pointer"
            color="success"
          />
        </CopyToClipboard>
      </>
    </Paragraph>
  </React.Fragment>
);

export default UploadBody;
