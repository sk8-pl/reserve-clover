import './style.css';
import React from 'react';
import {
  Input, Row, Col, InputNumber, Select, Button,
} from 'antd';
import { AimOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

type ObjectPoint = {
  lat: any;
  lon: any;
  height: any;
  speed: any;
  action: any;
  index: number;
}

function CardPointTest(props: ObjectPoint) {
  const {
    lat, lon, height, index, speed, action,
  } = props;
  return (
    <Input.Group
      size="small"
      style={{
        border: '1px solid #c9c9c9',
        marginTop: '1rem',
        padding: '1rem',
      }}
    >
      <h3>
        Точка №
        {index + 1}
      </h3>
      <Row
        style={{
          justifyContent: 'space-between',
        }}
      >
        долгота
        <Col span={8}>
          <InputNumber
            defaultValue={lon}
            size="small"
            style={{
              marginLeft: '5px',
            }}
          />
        </Col>
      </Row>
      <Row
        style={{
          justifyContent: 'space-between',
        }}
      >
        широта
        <Col span={8}>
          <InputNumber
            defaultValue={lat}
            size="small"
            style={{
              marginLeft: '5px',
            }}
          />
        </Col>
      </Row>
      <Row
        style={{
          justifyContent: 'space-between',
        }}
      >
        высота
        <Col span={8}>
          <InputNumber
            defaultValue={height}
            size="small"
            style={{
              marginLeft: '5px',
            }}
          />
        </Col>
      </Row>
      <Row
        style={{
          justifyContent: 'space-between',
        }}
      >
        Скорость полета
        <Col span={8}>
          <InputNumber
            defaultValue={speed}
            size="small"
            style={{
              marginLeft: '5px',
            }}
          />
        </Col>
      </Row>
      <Row
        style={{
          justifyContent: 'space-between',
        }}
      >
        actions
        <Col span={8}>
          <Select
            defaultValue="action"
            size="small"
            style={{
              width: '95px',
            }}
          >
            {action.map((e: any) => <Option value={e}>{e}</Option>)}
          </Select>
        </Col>
      </Row>
      <Row>
        <Button type="primary" icon={<SettingOutlined />} size="small" />
        <Button type="default" icon={<AimOutlined />} size="small" />
      </Row>
    </Input.Group>
  );
}

export default CardPointTest;
