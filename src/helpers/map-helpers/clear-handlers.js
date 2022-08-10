/* eslint-disable no-underscore-dangle */
/* eslint-disable eqeqeq */
/* eslint-disable no-undef */
import modeGeometry, { isPick } from './variables';
import viewerObject from './viewer-variable';
import store from '../../store';
import { pickPolygon } from '../../store/grab-polygon/grab-polygon';

function clearHandlers() {
  if (modeGeometry.mode !== null) {
    modeGeometry.mode.destroy();
    modeGeometry.mode = new Cesium.ScreenSpaceEventHandler(viewerObject.viewer.canvas);
    modeGeometry.mode.setInputAction((click) => {
      const pickedObject = viewerObject.viewer.scene.pick(click.position);

      if (pickedObject != undefined && pickedObject.id._polygon._hierarchy._value.positions) {
        const arrayPosition = [...pickedObject.id._polygon._hierarchy._value.positions];
        arrayPosition.map((e) => {
          const pos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(e);
          pos.latitude = (pos.latitude * 180) / Math.PI;
          pos.longitude = (pos.longitude * 180) / Math.PI;
          pos.height = 600;
          isPick.polygonVertices = [...isPick.polygonVertices, [pos.longitude, pos.latitude]];
          return pos;
        });
        isPick.value = true;
      } else {
        isPick.value = false;
        isPick.polygonVertices = [];
      }
      store.dispatch(pickPolygon(isPick));
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}

export default clearHandlers;
