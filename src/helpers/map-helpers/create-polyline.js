/* eslint-disable no-undef */
import viewerObject from './viewer-variable';

function createPolyline(
  entities, // : Cesium.EntityCollection,
  color, // : Cesium.Color,
  viewer, // : Cesium.Viewer,
  pointName, // : string
  clampToGround, // : clamp to ground true/false
  width, // width line
) {
  const positions = [];

  const timeNow = Cesium.JulianDate.now();

  const positionCallback = () => {
    if (positions.length === 0) {
      entities.values.forEach((entity) => {
        positions.push(entity.position.getValue(timeNow));
      });
    } else if (positions.length > 0) {
      positions[0] = entities.values[0].position.getValue(timeNow);
      positions[1] = entities.values[1].position.getValue(timeNow);
      entities.values.forEach((entity, i) => {
        positions[i] = entity.position.getValue(timeNow);
      });
    }
    return positions;
  };

  const positionCBP = new Cesium.CallbackProperty(positionCallback, false);

  const polyline = new Cesium.PolylineGraphics({
    positions: positionCBP,
    material: color,
    width,
    clampToGround,
  });

  const myPolyline = new Cesium.Entity({
    polyline,
    name: pointName,
  });

  viewerObject.viewer.entities.add(myPolyline);
}

export default createPolyline;
