/* eslint-disable no-undef */
function createCesiumPoint(coordinates, size, color) {
  const point = new Cesium.PointGraphics({
    pixelSize: size,
    color,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  });

  const entity = new Cesium.Entity({
    position: coordinates,
    point,
  });

  return entity;
}

export default createCesiumPoint;
