/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable max-len */
/* eslint-disable space-infix-ops */
import updatePolylineHeight from './upd-height-polyline';
import viewerObject from './viewer-variable';
import { myPointsHeight, pickedEntityObject } from './variables';
import updatePolylineHeightPolygone from './upd-height-polyline-polygone';

let collectionHeightPoints = [];

async function drawHeightPoint(waypointPosition, height, id, isPolygone, isUpdate) {
  const entity = viewerObject.viewer.entities.add({
    description: 'qwe',
    position: waypointPosition,
    name: 'Draggable_PointHeight',
    id: `${id}heightPoint`,
    point: { pixelSize: 10, color: Cesium.Color.YELLOW },
    label: {
      text: height,
      pixelOffset: new Cesium.Cartesian2(0.0, -25),
    },
  });

  if (myPointsHeight.getById(`${id}heightPoint`)) {
    let indexCurrPoint = null;
    pickedEntityObject.arrayPoints.map((e) => {
      if (e.id === `${id}heightPoint`) {
        indexCurrPoint = pickedEntityObject.arrayPoints.indexOf(e);
      }
      return false;
    });
    pickedEntityObject.arrayPoints.splice(indexCurrPoint, 1, entity);
  } else {
    pickedEntityObject.arrayPoints.push(entity);
  }
  collectionHeightPoints.push(entity);

  let dragging = false;
  const handler = new Cesium.ScreenSpaceEventHandler(viewerObject.viewer.canvas);
  handler.setInputAction((click) => {
    const pickedObject = viewerObject.viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
      entity.point.pixelSize = 13;
      dragging = true;
      viewerObject.viewer.scene.screenSpaceCameraController.enableRotate = false;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  handler.setInputAction((movement) => {
    if (dragging) {
      const cartesian = entity.position.getValue(
        Cesium.JulianDate.fromDate(new Date()),
      );
      const cartographic = viewerObject.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      //   const surfaceNormal = viewerObject.viewer.scene.globe.ellipsoid.geodeticSurfaceNormal(cartesian);
      let planeNormal = Cesium.Cartesian3.subtract(
        viewerObject.viewer.scene.camera.position,
        cartesian,
        new Cesium.Cartesian3(),
      );
      planeNormal = Cesium.Cartesian3.normalize(planeNormal, planeNormal);
      const ray = viewerObject.viewer.scene.camera.getPickRay(movement.endPosition);
      const plane = Cesium.Plane.fromPointNormal(cartesian, planeNormal);
      const newCartesian = Cesium.IntersectionTests.rayPlane(ray, plane);
      const newCartographic= viewerObject.viewer.scene.globe.ellipsoid.cartesianToCartographic(newCartesian);
      const { height } = newCartographic;
      cartographic.height = height;
      entity.label.text = height.toFixed(1);
      entity.position.setValue(
        viewerObject.viewer.scene.globe.ellipsoid.cartographicToCartesian(cartographic),
      );
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(() => {
    entity.point.pixelSize = 10;
    dragging = false;
    viewerObject.viewer.scene.screenSpaceCameraController.enableRotate = true;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  if (isPolygone) {
    if (isUpdate) {
      updatePolylineHeightPolygone(collectionHeightPoints);
      collectionHeightPoints = [];
    } else {
      updatePolylineHeightPolygone(collectionHeightPoints);
    }
  } else {
    updatePolylineHeight();
    // collectionHeightPoints = [];
  }
}

export default drawHeightPoint;
