import React, { useState } from 'react';
import {
  Button, Input, Space, Drawer,
} from 'antd';
import './style.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { getGulsPolygon } from '../../../../helpers/server-math/server-math';

function ModalPolgoneOption() {
  const Points = useSelector((state: RootState) => state.isGrab.polygonVertices);
  const [visible, setVisible] = useState(false);
  const [optionSpeed, setOptionSpeed] = useState('10');
  const [optionWidth, setOptionWidth] = useState('5');
  const [optionMaxTime, setOptionMaxTime] = useState('20');
  const [optionAgle, setOptionAgle] = useState('30');

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <Space
      style={{
        position: 'absolute',
        top: '45px',
        left: '60px',
        width: '335px',
        padding: '2px',
        display: 'flex',
        flexWrap: 'wrap',
        backgroundColor: '#30333670',
        alignItems: 'inherit',
        zIndex: 10,
      }}
    >
      <Button type="primary" onClick={showDrawer}>
        Вершины полигона
      </Button>
      <Drawer title="Polygon vertices" placement="right" onClose={onClose} visible={visible}>
        {Points.map((e) => (
          <div
            key={e}
            style={{
              border: 'solid 1px',
              margin: '3px',
              padding: '3px',
            }}
          >
            <p>
              latitude:
              {' '}
              {e[0]}
            </p>
            <p>
              longitude:
              {' '}
              {e[1]}
            </p>
          </div>
        ))}
      </Drawer>
      <Button
        type="default"
        onClick={() => {
          getGulsPolygon({
            povorot: optionAgle,
            maxT1: optionMaxTime,
            shir1: optionWidth,
            speedP1: optionSpeed,
            poly22: Points,
          });
        }}
      >
        Разделить на галcы

      </Button>

      <Input style={{ width: '330px' }} addonBefore="Скорость движения" defaultValue={optionSpeed} type="number" onChange={(e) => setOptionSpeed(e.target.value)} />
      <Input style={{ width: '330px' }} addonBefore="Ширина прохода" defaultValue={optionWidth} type="number" onChange={(e) => setOptionWidth(e.target.value)} />
      <Input style={{ width: '330px' }} addonBefore="Максимальное время полета" defaultValue={optionMaxTime} type="number" onChange={(e) => setOptionMaxTime(e.target.value)} />
      <Input style={{ width: '330px' }} addonBefore="Дирекционный угол" defaultValue={optionAgle} type="number" onChange={(e) => setOptionAgle(e.target.value)} />

    </Space>
  );
}

export default ModalPolgoneOption;
