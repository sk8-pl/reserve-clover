import React from 'react';
import './style.css';
import { Space, Collapse } from 'antd';
import { useSelector } from 'react-redux';
import { CloudUploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import CardMission from '../card-PZ';
import { RootState } from '../../../../store';

const { Panel } = Collapse;

function PanelInfo() {
  const data = useSelector((state: RootState) => state.storePZ.value);

  const genExtra = () => (
    <>
      <CloudUploadOutlined
        className="collapse-icon"
        onClick={() => {
          console.log('отправка на сервер');
        }}
      />

      <DeleteOutlined
        className="collapse-icon"
        onClick={() => {
          console.log('отправка на сервер');
        }}
      />

      <EyeOutlined
        className="collapse-icon"
        onClick={() => {
          console.log('отправка на сервер');
        }}
      />

    </>
  );

  return (
    <Space
      className="space-infopanel"
      style={{
        position: 'absolute',
        top: '40px',
        right: '5px',
        maxWidth: '45%',
        padding: '2px',
        display: 'flex',
        backgroundColor: '#30333670',
        flexWrap: 'wrap',
        zIndex: 10,
        maxHeight: 'calc(100% - 70px)',
        overflowY: 'scroll',
      }}
    >
      <Collapse>
        {data ? data.map((el) => (
          <Panel header={el.name} key={el.name} extra={genExtra()}>
            <Collapse
              style={{
                padding: '2px',
                display: 'flex',
                backgroundColor: '#fff',
                flexWrap: 'wrap',
                zIndex: 10,
              }}
            >
              <CardMission flyMission={el.flyMissions} />
            </Collapse>
          </Panel>
        )) : false}
      </Collapse>
    </Space>
  );
}

export default PanelInfo;
