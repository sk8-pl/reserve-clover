/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */
import { viewer } from './geoServerInitial';

const drawingMode = 'polygon';
let activeShapePoints = [];
let activeShape;
let floatingPoint;
let pickedEntity;

const label = {
  font: '14px monospace',
  showBackground: false,
  horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM,
  verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  pixelOffset: new Cesium.Cartesian2(0, -10),
  eyeOffset: new Cesium.Cartesian3(0, 0, 0),
};

const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

function disableCameraMotion(state, viewer) {
  viewer.scene.screenSpaceCameraController.enableRotate = state;
  viewer.scene.screenSpaceCameraController.enableZoom = state;
  viewer.scene.screenSpaceCameraController.enableLook = state;
  viewer.scene.screenSpaceCameraController.enableTilt = state;
  viewer.scene.screenSpaceCameraController.enableTranslate = state;
}

function createCesiumPoint(coordinates, size, color) {
  const point = new Cesium.PointGraphics({
    pixelSize: size,
    color,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    // heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
  });
  label.text = 'point';

  const entity = new Cesium.Entity({
    position: coordinates,
    point,
    label,
  });

  return entity;
}

function createDraggableWaypoint(waypointPosition, viewer) {
  let picked = false;

  const positionCallback = (time, result) => waypointPosition.clone(result);

  const positionCBP = new Cesium.CallbackProperty(positionCallback, false);

  const myPoint = createCesiumPoint(
    positionCBP,
    15,
    Cesium.Color.RED,
    Cesium.Color.WHITE,
  );

  myPoint.endPosition = waypointPosition;
  myPoint._name = 'Draggable_Point';
  myPoint.add;
  viewer.entities.add(myPoint);

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  handler.setInputAction((click) => {
    const pickedObject = viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id === myPoint) {
      picked = true;
      disableCameraMotion(false, viewer);
      pickedEntity = pickedObject.id;
      pickedEntity.point.pixelSize = 20;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  handler.setInputAction((movement) => {
    if (!picked) {
      return;
    }
    waypointPosition = viewer.camera.pickEllipsoid(
      movement.endPosition,
      viewer.scene.globe.ellipsoid,
    );
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction((movement) => {
    picked = false;
    disableCameraMotion(true, viewer);

    myPoint.point.pixelSize = 15;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  return myPoint;
}

function createPoint(waypointPosition, viewer) {
  const entity = createDraggableWaypoint(waypointPosition, viewer);
  return entity;
}

function drawShape(positionData) {
  console.log(positionData);

  let shape;
  shape = viewer.entities.add({
    polygon: {
      hierarchy: positionData,
      material: new Cesium.ColorMaterialProperty(
        Cesium.Color.WHITE.withAlpha(0.3),
      ),
    },
  });
  return shape;
}

function terminateShape() {
  activeShapePoints.pop();
  drawShape(activeShapePoints);
  viewer.entities.remove(floatingPoint);
  viewer.entities.remove(activeShape);
  floatingPoint = undefined;
  activeShape = undefined;
  activeShapePoints = [];
}

handler.setInputAction((event) => {
  const earthPosition = viewer.scene.pickPosition(event.position);

  if (Cesium.defined(earthPosition)) {
    if (activeShapePoints.length === 0) {
      floatingPoint = createPoint(earthPosition, viewer);
      activeShapePoints.push(earthPosition);
      const dynamicPositions = new Cesium.CallbackProperty((() => new Cesium.PolygonHierarchy(activeShapePoints)), false);
      activeShape = drawShape(dynamicPositions);
    }
    activeShapePoints.push(earthPosition);
    createPoint(earthPosition, viewer);
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

handler.setInputAction((event) => {
  if (Cesium.defined(floatingPoint)) {
    const newPosition = viewer.scene.pickPosition(event.endPosition);
    if (Cesium.defined(newPosition)) {
      floatingPoint.position.value = newPosition;
      activeShapePoints.pop();
      activeShapePoints.push(newPosition);
    }
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

handler.setInputAction((event) => {
  terminateShape();
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
