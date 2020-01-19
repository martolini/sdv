import React from 'react';
import { Icon, Upload } from 'antd';

const { Dragger } = Upload;
export default function UploadZone() {
  return (
    <Dragger openFileDialogOnClick={false}>
      <p className="ant-upload-drag-icon">
        <Icon type="inbox" />
      </p>
      <p className="ant-upload-text">
        Drag and drop a save file to this area to upload
      </p>
      <p className="ant-upload-hint">
        The save file (e.g. named Player_123456789) is located under:
      </p>
      <p className="ant-upload-hint" />
      <ul style={{ listStyle: 'none' }}>
        <li>Windows: %AppData%\StardewValley\Saves\</li>
        <li>Mac OSX & Linux: ~/.config/StardewValley/Saves/</li>
      </ul>
    </Dragger>
  );
}
