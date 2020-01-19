import React from 'react';
import { Icon, Row, Col } from 'antd';
import { useStoreActions, useStoreState } from 'easy-peasy';
import styled from 'styled-components';
import { animated, useTransition } from 'react-spring';
import UploadZone from './UploadZone';
import ExternalLink from './ExternalLink';

const Wrapper = styled.div`
  margin: 16px 12px 0 12px;
  background: #fff;
  padding: 20px;
  position: relative;

  .close-icon {
    &hover: {
      opacity: 0.7;
    }
  }
`;

const FirstTimeUseGuide = () => {
  const showFirstTimeUse = useStoreState(state => state.showFirstTimeUse);
  const setShowFirstTimeUse = useStoreActions(
    actions => actions.setShowFirstTimeUse
  );
  const transitions = useTransition(showFirstTimeUse, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { color: 'white' },
  });

  return transitions.map(
    ({ item, key, props }) =>
      item && (
        <animated.div key={key} style={props}>
          <Wrapper>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <p>
                  Welcome to the ultimate Stardew Valley Tool!&nbsp;
                  <Icon type="rocket" theme="twoTone" twoToneColor="blue" />
                </p>
                <p>
                  The tool is simply designed to help you plan a new day on your
                  farm, to get the most out of your time playing the game. You
                  can preview planted crops, artisan equipment, animals, player
                  progress, and much more..
                </p>
                <p>
                  Take a look at one the latest uploaded farms or drop a save
                  file here to upload and preview your own farm.
                </p>
                <p>
                  Visit on laptop for the best experience. If you have any
                  suggestions or feedback, please leave it&nbsp;
                  <ExternalLink href="https://github.com/martolini/sdv/issues/new/choose">
                    here
                  </ExternalLink>
                  . Enjoy :)
                </p>
              </Col>
              <Col xs={24} md={12}>
                <UploadZone />
              </Col>
            </Row>
            <Icon
              className="close-icon"
              style={{
                position: 'absolute',
                top: 5,
                right: 5,
                fontSize: 14,
                cursor: 'pointer',
              }}
              type="close"
              onClick={() => setShowFirstTimeUse(false)}
            />
          </Wrapper>
        </animated.div>
      )
  );
};

export default FirstTimeUseGuide;
