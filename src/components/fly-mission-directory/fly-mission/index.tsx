import './style.css';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import initialGeo from '../../../general/map/geoServerInitial';
import { isPick } from '../../../helpers/map-helpers/variables';
import Instruments from './PZ-instruments';
import ModalPolgoneOption from './polygon-cut';
import { RootState } from '../../../store';
import PanelModePZ from '../choice-mode-PZ';
import WeatherModal from './weather-modal';
// import PanelInfo from './info-panel';

function FlyMission() {
  const [isViewer, setViewer] = useState(false);
  const openCutPolygon = useSelector((state: RootState) => state.isGrab.value);

  useEffect(() => console.log(isPick), [isPick.value]);

  useEffect(() => {
    if (!isViewer) {
      initialGeo();
      setViewer(true);
    }
  }, [isViewer]);

  return (
    <div
      id="cesiumContainer"
      style={{
        position: 'relative',
      }}
    >
      <Instruments />
      {openCutPolygon ? <ModalPolgoneOption /> : null}
      {/* <PanelInfo /> */}
      <PanelModePZ />
      <WeatherModal />
    </div>
  );
}

export default FlyMission;
