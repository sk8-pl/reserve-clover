import './style.css';
import React from 'react';
import {
  Button, Collapse, Input, Select, Space,
} from 'antd';
import CollapsePanel from 'antd/lib/collapse/CollapsePanel';
import { sendServerPZ } from '../../../../general/map/geoServerInitial';

const { Option } = Select;

function CollapseRoute() {
  return (
    <Space
      style={{
        position: 'absolute',
        top: '50px',
        right: '8px',
        padding: '5px',
        display: 'flex',
        backgroundColor: '#30333670',
        flexWrap: 'wrap',
        alignItems: 'inherit',
        zIndex: 10,
      }}
    >
      {' '}
      <Space
        style={{
          flexDirection: 'column',
          alignItems: 'inherit',
        }}
      >
        <Input style={{ width: '330px' }} addonBefore="Скорость движения для всех точек" defaultValue={10} type="number" onChange={(e) => console.log(e.target.value)} />
        <Select defaultValue="Выбор action для всех точек" style={{ width: '100%' }}>
          <Option value="Action_1">Action_1</Option>
          <Option value="Action_2">Action_2</Option>
          <Option value="Action_3" disabled>
            недоступный Action_3
          </Option>
          <Option value="Action_4">Action_4</Option>
        </Select>

        <Button
          id="send-to-server"
          type="primary"
          onClick={() => sendServerPZ()}
        >
          Отправить
        </Button>
        {' '}

      </Space>

      <Collapse bordered={false}>
        <CollapsePanel header="Имя точки 1" key="1">
          {/* <CardPoint /> */}
        </CollapsePanel>
        <CollapsePanel header="Имя точки 2" key="2">
          {/* <CardPoint /> */}
        </CollapsePanel>
        <CollapsePanel header="Имя точки 3" key="3">
          {/* <CardPoint /> */}
        </CollapsePanel>
      </Collapse>
    </Space>
  );
}

export default CollapseRoute;
