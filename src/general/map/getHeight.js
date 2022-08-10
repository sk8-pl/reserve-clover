// get height from terrainProvider
import viewer from './geoServerInitial';
import { scene, createPolyline } from './test';

let arrayPoints = [];
let counterPointsHeight = 0;
const myPointsHeight = new Cesium.EntityCollection();

export function clearPointsHeight() {
  myPointsHeight.removeAll();
  counterPointsHeight = 0;
  arrayPoints = [];
}

function updatePolylineHeight() {
  if (arrayPoints.length > 1) {
    myPointsHeight.removeAll();
    arrayPoints.forEach((e) => {
      myPointsHeight.add(e);
    });
    // if (myPointsHeight._entities._array.length > 1) {
    createPolyline(
      myPointsHeight,
      Cesium.Color.WHITE,
      viewer,
      'Dynamic line',
      false,
      2,
    );
  }
}

export default function getHeight(waypointPosition, id) {
  const { ellipsoid } = viewer.scene.globe;
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
  Cesium.sampleTerrain(viewer.terrainProvider, 9, [pointOfInterest]).then(
    (samples) => {
      const altitude = samples[0].height.toFixed(1);
      params.alt = +altitude + 100;

      const a = Cesium.Cartographic.fromCartesian(waypointPosition);
      a.height = +altitude + 100;

      const b = Cesium.Cartographic.toCartesian(a);
      // b закинуть в коллекцию по которой потом пробегаться -------------------------------------<<<<<<<<<<<<<<<<

      drawHeightPoint(b, `${+altitude + 100}`, id);

      //   var entity = viewer.entities.add({
      //     position: b,
      //     point: { pixelSize: 10, color: Cesium.Color.YELLOW },
      //     label: {
      //       text: "1000",
      //     },
      //   });
    },
  );
  return params;
}

export async function drawHeightPoint(waypointPosition, height, id) {
  //   var position2 = Cesium.Cartesian3.fromRadians(
  //     camera.positionCartographic.longitude,
  //     camera.positionCartographic.latitude,
  //     1000
  //   );
  //   const position = waypointPosition;
  //   const pos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position)
  //   pos.latitude = (pos.latitude * 180) / Math.PI;
  //   pos.longitude = (pos.longitude * 180) / Math.PI;
  //   pos.height = 1500;
  //   let a = Cesium.Cartographic.fromCartesian(waypointPosition);
  //   a.latitude = (a.latitude * 180) / Math.PI;
  //   a.longitude = (a.longitude * 180) / Math.PI;

  //   a.latitude = (a.latitude * Math.PI) / 180;
  //   a.longitude = (a.longitude * Math.PI) / 180;
  //   a.height = positionPoint.alt;

  //   let b = Cesium.Cartographic.toCartesian(a);

  const entity = viewer.entities.add({
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
    arrayPoints.map((e) => {
      if (e.id === `${id}heightPoint`) {
        indexCurrPoint = arrayPoints.indexOf(e);
      }
    });
    arrayPoints.splice(indexCurrPoint, 1, entity);
    // если уже есть, то удалить
    // const entityPoint = myPointsHeight.getById(id + "heightPoint");
    // const indexEntity = myPointsHeight.values.indexOf(entityPoint);
    // if (indexEntity > 0) {
    //   entity.description = `${indexEntity}`
    //   myPointsHeight.values.splice(indexEntity, 1, entity);
    // } else {
    //   myPointsHeight.values.splice(+entity.description, 1, entity);
    // }
    // console.log(myPointsHeight)
    // myPointsHeight.remove(entityPoint);

    // myPointsHeight._entities._array[indexEntity].position.setValue(
    //   waypointPosition
    // );
    // myPointsHeight.values[indexEntity].position._value = waypointPosition
  } else {
    arrayPoints.push(entity);
    // myPointsHeight.add(entity); // добавил сущность в коллекцию
  }

  let dragging = false;
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  handler.setInputAction((click) => {
    const pickedObject = scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id === entity) {
      entity.point.pixelSize = 13;
      dragging = true;
      scene.screenSpaceCameraController.enableRotate = false;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  handler.setInputAction((movement) => {
    if (dragging) {
      const cartesian = entity.position.getValue(
        Cesium.JulianDate.fromDate(new Date()),
      );
      const cartographic = scene.globe.ellipsoid.cartesianToCartographic(cartesian);
      const surfaceNormal = scene.globe.ellipsoid.geodeticSurfaceNormal(cartesian);
      let planeNormal = Cesium.Cartesian3.subtract(
        scene.camera.position,
        cartesian,
        new Cesium.Cartesian3(),
      );
      planeNormal = Cesium.Cartesian3.normalize(planeNormal, planeNormal);
      const ray = viewer.scene.camera.getPickRay(movement.endPosition);
      const plane = Cesium.Plane.fromPointNormal(cartesian, planeNormal);
      const newCartesian = Cesium.IntersectionTests.rayPlane(ray, plane);
      const newCartographic = viewer.scene.globe.ellipsoid.cartesianToCartographic(newCartesian);
      const { height } = newCartographic;
      cartographic.height = height;
      entity.label.text = height.toFixed(1);
      entity.position.setValue(
        scene.globe.ellipsoid.cartographicToCartesian(cartographic),
      );
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction(() => {
    entity.point.pixelSize = 10;
    dragging = false;
    scene.screenSpaceCameraController.enableRotate = true;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  updatePolylineHeight();
}

export async function drawRouteDrone() {
  const flightDataSecond = [];

  arrayPoints.forEach((e) => {
    if (e.name == undefined) {
      viewer.entities.remove(e);
    } else if (e.name === 'Draggable_PointHeight') {
      const pos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
        e._position._value,
      );
      pos.latitude = (pos.latitude * 180) / Math.PI;
      pos.longitude = (pos.longitude * 180) / Math.PI;
      flightDataSecond.push(pos);
    }
  });

  const timeStepInSeconds = 30;
  const totalSeconds = timeStepInSeconds * (arrayPoints.length - 1);
  const start = Cesium.JulianDate.now();
  const stop = Cesium.JulianDate.addSeconds(
    start,
    totalSeconds,
    new Cesium.JulianDate(),
  );
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.timeline.zoomTo(start, stop);
  viewer.clock.multiplier = 15;
  viewer.clock.shouldAnimate = true;

  const positionProperty = new Cesium.SampledPositionProperty();

  for (let i = 0; i < flightDataSecond.length; i++) {
    const dataPoint = flightDataSecond[i];

    const time = Cesium.JulianDate.addSeconds(
      start,
      i * timeStepInSeconds,
      new Cesium.JulianDate(),
    );
    const position = Cesium.Cartesian3.fromDegrees(
      dataPoint.longitude,
      dataPoint.latitude,
      dataPoint.height,
    );
    positionProperty.addSample(time, position);

    viewer.entities.add({
      description: `Location: (${position.longitude}, ${position.latitude}, ${position.height})`,
      position,
      point: { pixelSize: 1, color: Cesium.Color.YELLOW },
      // label: {
      //   text: "height: " + dataPoint.height,
      //   font: "14px monospace",
      //   showBackground: false,
      //   horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM,
      //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      //   pixelOffset: new Cesium.Cartesian2(0, -10),
      //   eyeOffset: new Cesium.Cartesian3(0, 0, 0),
      // },
    });
  }

  airplaneEntity = viewer.entities.add({
    availability: new Cesium.TimeIntervalCollection([
      new Cesium.TimeInterval({ start, stop }),
    ]),
    position: positionProperty,
    point: { pixelSize: 30, color: Cesium.Color.GREEN },
    path: new Cesium.PathGraphics({ width: 1 }),
    label: {
      text: 'aircraft',
      font: '14px monospace',
      showBackground: false,
      horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      pixelOffset: new Cesium.Cartesian2(0, -15),
      eyeOffset: new Cesium.Cartesian3(0, 0, 0),
    },
  });
  // viewer.trackedEntity = airplaneEntity;
}
