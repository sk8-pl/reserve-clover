import './style.css';
import React, { useEffect, useState } from 'react';
import { Button, Space, Popover } from 'antd';
import Icon, { CameraOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { ReactComponent as RouteSvg } from '../../../../assets/svg/route.svg';
import { ReactComponent as PolygonSvg } from '../../../../assets/svg/polygon.svg';
import { ReactComponent as TrashSvg } from '../../../../assets/svg/trash.svg';
import { ReactComponent as DroneSvg } from '../../../../assets/svg/drone.svg';
import { ReactComponent as FlyMissionSvg } from '../../../../assets/svg/flymission.svg';
import { ReactComponent as Table } from '../../../../assets/svg/table.svg';
import { ReactComponent as PolygonSvg3d } from '../../../../assets/svg/polygon3d.svg';
import { ReactComponent as OffsetRoute } from '../../../../assets/svg/offset-route.svg';
import { ReactComponent as LoopCircle } from '../../../../assets/svg/loop-circle.svg';
import { ReactComponent as LoopPerimetr } from '../../../../assets/svg/loop-perimetr.svg';
import { ReactComponent as LoopSpiral } from '../../../../assets/svg/loop-spiral.svg';
import { ReactComponent as ClosePolygone } from '../../../../assets/svg/closed-polygone.svg';
import { ReactComponent as AttentionPolygone } from '../../../../assets/svg/attention-polygone.svg';
import { ReactComponent as WeatherSVG } from '../../../../assets/svg/weather.svg';
import {
  clearEntities,
  drawPolygones, drawPolyLine, getAllHandlers, getEntitiesHeight, setHundlerWeather,
} from '../../../../general/map/geoServerInitial';
import clearHandlers from '../../../../helpers/map-helpers/clear-handlers';
import PanelInfo from '../info-panel';
import { RootState } from '../../../../store';

function Instruments() {
  const [activeInstrument, setActiveInstrument] = useState('null');
  const [isOpenInfo, setOpenInfoPanel] = useState(false);
  const currentModeValue = useSelector((state: RootState) => state.actualMode.value);

  function changeInstruments(str: React.SetStateAction<string>) {
    if (str === activeInstrument) {
      setActiveInstrument('inactive');
    } else {
      setActiveInstrument(str);
    }
  }

  const toggleInfoPanel = () => (isOpenInfo ? setOpenInfoPanel(false) : setOpenInfoPanel(true));

  useEffect(() => {
    if (activeInstrument === 'polygon') {
      clearHandlers();
      drawPolygones();
    } else if (activeInstrument === 'route') {
      clearHandlers();
      drawPolyLine();
    } else if (activeInstrument === 'table') {
      getEntitiesHeight();
    } else if (activeInstrument === 'weather') {
      clearHandlers();
      setHundlerWeather();
    }

    if (activeInstrument === 'inactive') {
      clearHandlers();
    }

    console.log(activeInstrument);
    getAllHandlers();
  }, [activeInstrument]);

  return (
    <>
      <Space
        style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          maxWidth: '36px',
          padding: '2px',
          display: 'flex',
          backgroundColor: '#30333670',
          flexWrap: 'wrap',
          zIndex: 10,
        }}
      >
        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Левый клик - установить точку</p>
              <p>Правый клик - закончить полинию, начать новую</p>
            </div>
)}
          title="Полилиния"
        >
          <Button
            id="route"
            type={activeInstrument === 'route' ? 'primary' : 'default'}
            icon={<Icon component={RouteSvg} />}
            disabled={currentModeValue !== 'Route-mode'}
            onClick={() => changeInstruments('route')}
          />
        </Popover>

        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Левый клик - установить точку</p>
              <p>Правый клик - закончить полинию, начать новую</p>
            </div>
)}
          title="Облет вдоль линии"
        >
          <Button
            id="route-offset"
            type="default"
            icon={<Icon component={OffsetRoute} />}
            disabled={false}
            onClick={() => changeInstruments('test')}
          />
        </Popover>

        <Space className="instrument-collapse">
          <Popover
            placement="bottomLeft"
            content={(
              <div style={{
                fontSize: '10px',
              }}
              >
                <p>Левый клик - установить вершину полигона</p>
                <p>Правый клик - сформировать полигон, начать новый</p>
              </div>
)}
            title="Полигон"
          >
            <Button
              id="polygon"
              type={activeInstrument === 'polygon' ? 'primary' : 'default'}
              icon={<Icon component={PolygonSvg} />}
              disabled={currentModeValue !== 'Agro-mode'}
              onClick={() => changeInstruments('polygon')}
            />
          </Popover>
          <Popover
            placement="bottomLeft"
            content={(
              <div style={{
                fontSize: '10px',
              }}
              >
                <p>Левый клик - установить вершину полигона</p>
                <p>Правый клик - сформировать полигон, начать новый</p>
              </div>
)}
            title="Полигон с закрытой полетной зоной"
          >
            <Button
              id="polygon-warning"
              type={activeInstrument === 'polygon' ? 'primary' : 'default'}
              icon={<Icon component={ClosePolygone} />}
              disabled={currentModeValue !== 'Agro-mode'}
              onClick={() => changeInstruments('polygon')}
            />
          </Popover>
          <Popover
            placement="bottomLeft"
            content={(
              <div style={{
                fontSize: '10px',
              }}
              >
                <p>Левый клик - установить вершину полигона</p>
                <p>Правый клик - сформировать полигон, начать новый</p>
              </div>
)}
            title="Полигон с особыми условиями пролета"
          >
            <Button
              id="polygon-attention"
              type={activeInstrument === 'polygon' ? 'primary' : 'default'}
              icon={<Icon component={AttentionPolygone} />}
              disabled={currentModeValue !== 'Agro-mode'}
              onClick={() => changeInstruments('polygon')}
            />
          </Popover>
        </Space>
        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Левый клик - установить вершину полигона</p>
              <p>Правый клик - сформировать полигон, начать новый</p>
            </div>
)}
          title="Вертикальный полигон"
        >

          <Button
            id="polygon-3D"
            type="default"
            icon={<Icon component={PolygonSvg3d} />}
            disabled={false}
            onClick={() => changeInstruments('test')}
          />
        </Popover>

        <Space className="instrument-collapse">
          <Popover
            placement="bottomLeft"
            content={(
              <div style={{
                fontSize: '10px',
              }}
              >
                <p>Левый клик - установить вершину</p>
                <p>Правый клик - сформировать, начать новый</p>
              </div>
)}
            title="Циклический облет по кругу"
          >

            <Button
              id="route-loop"
              type="default"
              icon={<Icon component={LoopCircle} />}
              disabled={false}
              onClick={() => changeInstruments('test')}
            />
          </Popover>
          <Popover
            placement="bottomLeft"
            content={(
              <div style={{
                fontSize: '10px',
              }}
              >
                <p>Левый клик - установить вершину</p>
                <p>Правый клик - сформировать, начать новый</p>
              </div>
)}
            title="Циклический облет по периметру"
          >

            <Button
              id="route-loop"
              type="default"
              icon={<Icon component={LoopPerimetr} />}
              disabled={false}
              onClick={() => changeInstruments('test')}
            />
          </Popover>
          <Popover
            placement="bottomLeft"
            content={(
              <div style={{
                fontSize: '10px',
              }}
              >
                <p>Левый клик - установить вершину</p>
                <p>Правый клик - сформировать, начать новый</p>
              </div>
)}
            title="Спираль"
          >

            <Button
              id="route-loop"
              type="default"
              icon={<Icon component={LoopSpiral} />}
              disabled={false}
              onClick={() => changeInstruments('test')}
            />
          </Popover>
        </Space>

        <Button
          icon={<Icon component={TrashSvg} />}
          id="trash"
          type={activeInstrument === 'trash' ? 'primary' : 'default'}
          onClick={() => clearEntities()}
        />

      </Space>
      <Space
        style={{
          position: 'absolute',
          bottom: '5px',
          left: '5px',
          maxWidth: '36px',
          padding: '2px',
          display: 'flex',
          backgroundColor: '#30333670',
          flexWrap: 'wrap',
          zIndex: 10,
        }}
      >
        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Информация о погодных условиях</p>
            </div>
)}
          title="Погода"
        >
          <Button
            icon={<WeatherSVG />}
            id="weather"
            type={activeInstrument === 'weather' ? 'primary' : 'default'}
            onClick={() => changeInstruments('weather')}
          />
        </Popover>
        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Открыть модальное окно с настройками</p>
              <p>или видеопотоком с навесного модуля</p>
            </div>
)}
          title="Камера"
        >
          <Button
            icon={<CameraOutlined />}
            id="camera"
            type={activeInstrument === 'camera' ? 'primary' : 'default'}
            onClick={() => changeInstruments('camera')}
          />
        </Popover>

        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Открыть модальное окно с настройками МБЛА</p>
            </div>
)}
          title="МБЛА"
        >
          <Button
            icon={<Icon component={DroneSvg} />}
            id="drone"
            type={activeInstrument === 'drone' ? 'primary' : 'default'}
            onClick={() => changeInstruments('drone')}
          />
        </Popover>

        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Открыть модальное окно отображения гистограммы марщрута</p>
            </div>
)}
          title="Гистограмма"
        >
          <Button
            icon={<Icon component={FlyMissionSvg} />}
            id="gistogramma"
            type={activeInstrument === 'gistogramma' ? 'primary' : 'default'}
            onClick={() => changeInstruments('gistogramma')}
          />
        </Popover>

        <Popover
          placement="rightTop"
          content={(
            <div style={{
              fontSize: '10px',
            }}
            >
              <p>Открыть список полетных заданий построенных на карте</p>
            </div>
)}
          title="Список полетных заданий"
        >
          <Button
            icon={<Icon component={Table} />}
            id="table"
            type={isOpenInfo ? 'primary' : 'default'}
            onClick={() => toggleInfoPanel()}
          />
        </Popover>
      </Space>
      {isOpenInfo ? (
        <PanelInfo />
      )
        : <Space />}
    </>

  );
}

export default Instruments;
