import './style.css';
import React, { useState } from 'react';
import { AppstoreAddOutlined } from '@ant-design/icons';
import {
  Button, Input, Segmented, Space, Tooltip,
} from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { pickActualMode } from '../../../store/actual-mode/actual-mode';
import { pushModePZ } from '../../../store/store-PZ/store-PZ';
import { RootState } from '../../../store';

function PanelModePZ() {
  const dispatch = useDispatch();
  const currentModeValue = useSelector((state: RootState) => state.actualMode.value);

  const [nameValue, setNameValue] = useState('');

  const changeHandler = (e: any) => {
    const value = e as string;
    dispatch(pickActualMode(value));
    return false;
  };

  const nameValueHandler = (value: string) => {
    setNameValue(value);
  };

  const buttonHandler = () => {
    dispatch(pushModePZ([currentModeValue, nameValue]));
  };

  return (
    <Space
      style={{
        position: 'absolute',
        top: '5px',
        left: '45px',
        padding: '2px',
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: '#30333670',
        flexWrap: 'wrap',
        zIndex: 10,
      }}
    >
      <Segmented
        options={
          [
            { label: 'Маршрут', value: 'Route-mode', disabled: false },
            { label: 'Агро', value: 'Agro-mode', disabled: false },
            { label: 'Строймониторинг', value: 'Build-mode', disabled: true },
          ]
        }
        style={{
          backgroundColor: 'rgba(48, 51, 54, 0.44)',
        }}
        value={currentModeValue}
        onChange={(e) => changeHandler(e)}
      />
      <Input.Group
        compact
        style={{
          display: 'flex',
        }}
      >
        <Input
          style={{ width: '100%' }}
          onChange={(e) => nameValueHandler(e.target.value)}
          maxLength={20}
          value={nameValue}
          placeholder="Введите название ПЗ"
        />
        <Tooltip title="Создать полетное задание" placement="bottom">
          <Button icon={<AppstoreAddOutlined />} onClick={buttonHandler} />
        </Tooltip>
      </Input.Group>
    </Space>
  );
}

export default PanelModePZ;
