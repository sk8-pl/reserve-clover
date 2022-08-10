/* eslint-disable no-undef */
import viewerObject from './viewer-variable';
import { nullHeightPZObject } from './variables';
import drawHeightPoint from './draw-height-poiint';

function getHeight(waypointPosition, id, isPolygone, isUpdate) {
  const { ellipsoid } = viewerObject.viewer.scene.globe;
  const cartographic = ellipsoid.cartesianToCartographic(waypointPosition);
  const lat = Cesium.Math.toDegrees(cartographic.latitude);
  const lon = Cesium.Math.toDegrees(cartographic.longitude);
  const params = {
    id: `тест${lon}`,
    name: '',
    lon,
    lat,
    alt: 0,
  };

  const pointOfInterest = Cesium.Cartographic.fromDegrees(
    params.lon,
    params.lat,
  );

  // Sample the terrain (async) and write the answer to the console.
  Cesium.sampleTerrain(viewerObject.viewer.terrainProvider, 11, [pointOfInterest]).then(
    (samples) => {
      const altitude = samples[0].height.toFixed(1);
      if (nullHeightPZObject.nullHeightPZ === null) { nullHeightPZObject.nullHeightPZ = altitude; }
      params.alt = +altitude + 50;
      const a = Cesium.Cartographic.fromCartesian(waypointPosition);
      a.height = +altitude + 50;
      const b = Cesium.Cartographic.toCartesian(a);
      drawHeightPoint(b, `${+altitude + 50}`, id, isPolygone, isUpdate);
    },
  );

  return params;
}

export default getHeight;
