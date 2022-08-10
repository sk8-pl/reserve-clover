import './style.css';
import React from 'react';
import { Card, Space } from 'antd';

function WeatherModal() {
  return (
    <Space style={{
      position: 'absolute',
      bottom: '0',
      left: '100px',
      zIndex: '10',
    }}
    >
      <Card title="Card title" bordered={false} style={{ width: 300 }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </Space>
  );
}

export default WeatherModal;
