import React, { useState, useCallback } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

import 'antd/dist/antd.css';
import type { MenuProps } from 'antd';

import {
  Layout, Menu, Dropdown,
} from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import items from './helpers/routes/item-menu';
import RoutesContent from './helpers/routes/routes-content';
import RoutesTitle from './helpers/routes/routes-header-title';

const { Header, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);

  const navigate = useNavigate();
  const handleOnClick = useCallback((e) => navigate(`${e}`, { replace: true }), [navigate]);

  function toggle() {
    return setCollapsed(!collapsed);
  }

  const onMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
  };

  const menu = (
    <Menu
      onClick={onMenuClick}
      items={[
        {
          key: '1',
          label: 'при клике на имя пользователя => переход в ЛК пользователя',
        },
        {
          key: '2',
          label: 'переходы в различные разделы меню пользователя',
        },
        {
          key: '3',
          label: 'или отображения какой либо информации',
        },
        {
          key: '4',
          label: 'пример опции №4',
        },
        {
          key: '5',
          label: 'пример опции №5',
        },
      ]}
    />
  );

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={items}
          onClick={(e) => { handleOnClick(e.key); }}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          marginLeft: collapsed ? '80px' : '200px',
        }}
      >
        <Header className="site-layout-background" style={{ display: 'flex' }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              style: {
                color: '#fff',
              },
              className: 'trigger',
              onClick: () => toggle(),
            },
          )}
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            marginLeft: '15px',
          }}
          >
            <RoutesTitle />
            <div
              className="left-head"
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Dropdown.Button overlay={menu} size="large">
                <UserOutlined />
                Пользователь №1
              </Dropdown.Button>
            </div>

          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            minHeight: 280,
            transition: 'all .2s',
          }}
        >
          <RoutesContent />
        </Content>
      </Layout>
    </Layout>

  );
}
export default App;
