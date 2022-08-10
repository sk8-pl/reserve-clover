import { CloudUploadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React, { useEffect } from 'react';
import { PZObject } from '../../../../interfaces/ObjectFromStorePZ.interface';
import CardPointTest from '../card-point';
import './style.css';

const { Panel } = Collapse;

// const data = [
//   [85.98302925544387, 52.0247796607311, 115, 10, []],
//   [85.98356974876896, 52.02253265039095, 100.3, 10, []],
//   [85.98563333782289, 52.022370984535755, 87.8, 10, []],
//   [85.98569766585815, 52.02507787212025, 150.9, 10, []],
// ];

const genExtra = () => (
  <>
    <CloudUploadOutlined
      className="collapse-icon"
      onClick={(e) => {
        e.stopPropagation();
        console.log('отправка на сервер');
      }}
    />

    <DeleteOutlined
      className="collapse-icon"
      onClick={(e) => {
        e.stopPropagation();
        console.log('удалить узел');
      }}
    />

    <EyeOutlined
      className="collapse-icon"
      onClick={(e) => {
        e.stopPropagation();
        console.log('показать/скрыть на карте');
      }}
    />

  </>
);

interface PropsFlyMission {
  flyMission: Array<PZObject>
}

function CardMission(props: PropsFlyMission) {
  const { flyMission } = props;
  const recharge = () => flyMission.map((e) => console.log(e));
  useEffect(() => {
    recharge();
  });

  return (
    <div>
      <Collapse
        style={{
          padding: '2px',
          display: 'flex',
          backgroundColor: '#fff',
          flexWrap: 'wrap',
          zIndex: 10,
        }}
      >
        {flyMission.map((obj) => (
          <Panel header={obj.name} key={obj.name} extra={genExtra()}>
            {obj.points.map((point, i) => (
              <CardPointTest
                lat={point.lat}
                lon={point.lon}
                height={point.alt}
                speed={point.speed}
                action={point.actions}
                index={i}
                key={point.lat + point.lon + point.alt}
              />
            ))}
          </Panel>
        ))}

      </Collapse>
    </div>
  );
}

export default CardMission;
