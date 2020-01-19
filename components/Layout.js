/* eslint-disable jsx-a11y/anchor-is-valid */
import { Layout, Menu, Icon } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useStoreState } from 'easy-peasy';
import KeepQueryLink from './KeepQueryLink';
import Header from './Header';
import Footer from './Footer';
import ExternalLink from './ExternalLink';
import FirstTimeUseGuide from './FirstTimeUseGuide';

const { Content, Sider } = Layout;

const OuterDiv = styled.div`
  font-family: VT323;
  line-height: 1;
  font-size: 18px;

  .ant-table {
    font-size: 18px !important;
  }

  .ant-checkbox-wrapper {
    font-size: 18px !important;
  }

  .ant-tag {
    font-size: 18px !important;
  }

  .ant-select {
    font-size: 18px !important;
  }

  .ant-menu-inline .ant-menu-item {
    font-size: 18px !important;
  }
`;

export default function LayoutView({ children }) {
  const { pathname } = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const showFirstTimeUse = useStoreState(state => state.showFirstTimeUse);
  return (
    <OuterDiv>
      <Head>
        <title>Stardew guide</title>
        <link
          href="https://fonts.googleapis.com/css?family=VT323&display=swap"
          rel="stylesheet"
        />
        <meta
          property="title"
          content="A plan-your-day app for Stardew Valley"
        />
        <meta property="og:url" content="https://sdv.msroed.now.sh" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://storage.cloud.google.com/stardew-help.appspot.com/meta/farm.jpg"
        />
        <meta
          property="image"
          content="https://storage.cloud.google.com/stardew-help.appspot.com/meta/farm.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="668" />
        <meta property="og:title" content="sdv dayplanner" />
        <meta
          property="og:description"
          content="A plan-your-day app for Stardew Valley"
        />
      </Head>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={c => setCollapsed(c)}
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[pathname.split('/').slice(-1)[0]]}
          >
            <Menu.Item key="farm">
              <KeepQueryLink href="/farm">
                <a>
                  <Icon type="home" />
                  <span className="nav-text">Farm</span>
                </a>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="inventory">
              <KeepQueryLink href="/inventory">
                <a>
                  <Icon type="database" />
                  <span className="nav-text">Inventory</span>
                </a>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="bundles">
              <KeepQueryLink href="/bundles">
                <a>
                  <Icon type="appstore" />
                  <span className="nav-text">Bundles</span>
                </a>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="forage">
              <KeepQueryLink href="/forage">
                <a>
                  <Icon type="environment" />
                  <span className="nav-text">Forage</span>
                </a>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="mines">
              <KeepQueryLink href="/mines">
                <a>
                  <Icon type="alert" />
                  <span className="nav-text">Mines</span>
                </a>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Item key="farmer">
              <KeepQueryLink href="/farmer">
                <a>
                  <Icon type="usergroup-add" />
                  <span className="nav-text">Farmer & farmhands</span>
                </a>
              </KeepQueryLink>
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="feedback">
              <ExternalLink href="https://github.com/martolini/sdv/issues/new/choose">
                <Icon type="form" />
                <span className="nav-text">Feedback</span>
              </ExternalLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header />
          {showFirstTimeUse && <FirstTimeUseGuide />}
          <Content style={{ margin: '16px 12px 0', overflow: 'initial' }}>
            <div style={{ padding: 16, background: '#fff' }}>{children}</div>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </OuterDiv>
  );
}
