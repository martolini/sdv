import React from 'react';
import { Icon, Row, Col } from 'antd';
import UploadZone from './UploadZone';
import ExternalLink from './ExternalLink';

const FirstTimeUseGuide = () => (
  <Row
    gutter={16}
    style={{
      margin: '16px 12px 0 12px',
      background: '#fff',
      padding: '16px',
    }}
  >
    <Col span={12}>
      <p>
        Welcome to the ultimate Stardew Valley Tool!&nbsp;
        <Icon type="rocket" theme="twoTone" twoToneColor="blue" />
      </p>
      <p>
        The tool is simply designed to help you plan a new day on your farm, to
        get the most out of your time playing the game. You can preview planted
        crops, artisan equipment, animals, player progress, and much more..
      </p>
      <p>
        Take a look at one the latest uploaded farms or drop a save file here to
        upload and preview your own farm.
      </p>
      <p>
        If you have any suggestions or feedback, please leave it{' '}
        <ExternalLink href="https://github.com/martolini/sdv/issues/new/choose">
          here
        </ExternalLink>
        . Enjoy :)
      </p>
    </Col>
    <Col span={12}>
      <UploadZone />
    </Col>
  </Row>
);

export default FirstTimeUseGuide;
