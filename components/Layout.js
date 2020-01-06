import { Layout, Menu, Icon } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import KeepQueryLink from './KeepQueryLink';
import Header from './Header';
import Footer from './Footer';

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

const { Content, Sider } = Layout;

export default function LayoutView(props) {
  const { pathname } = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  return (
    <OuterDiv>
      <Head>
        <title>Stardew guide</title>
        <link
          href={`https://fonts.googleapis.com/css?family=VT323&display=swap`}
          rel="stylesheet"
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
          <div className="logo" />
          <Menu theme="dark" mode="inline" selectedKeys={[pathname.slice(1)]}>
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
            <Menu.Item key="user">
              <KeepQueryLink href="/user">
                <a>
                  <Icon type="user" />
                  <span className="nav-text">User</span>
                </a>
              </KeepQueryLink>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header />
          <Content style={{ margin: '16px 12px 0', overflow: 'initial' }}>
            <div style={{ padding: 16, background: '#fff' }}>
              {props.children}
            </div>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    </OuterDiv>
  );
}
