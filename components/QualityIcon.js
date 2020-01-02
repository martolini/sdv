import React from 'react';
import { Icon } from 'antd';

export const qualityIcons = {
  0: null,
  1: <Icon type="star" theme="filled" style={{ color: 'silver' }} />,
  2: <Icon type="star" theme="filled" style={{ color: 'gold' }} />,
  4: <Icon type="star" theme="filled" style={{ color: 'magenta' }} />,
};

export default function QualityIcon(props) {
  return qualityIcons[props.quality] || null;
}
