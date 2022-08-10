/* eslint-disable no-undef */
import { pickedEntityObject } from './variables';
import viewerObject from './viewer-variable';
import createPolyline from './create-polyline';

function updatePolylineHeight() {
  const myPointsHeight = new Cesium.EntityCollection();
  console.log('pickedEntityObject.arrayPoints', pickedEntityObject.arrayPoints);

  if (pickedEntityObject.arrayPoints.length > 1) {
    myPointsHeight.removeAll();
    pickedEntityObject.arrayPoints.forEach((e) => {
      myPointsHeight.add(e);
    });
    // if (myPointsHeight._entities._array.length > 1) {
    createPolyline(
      myPointsHeight,
      Cesium.Color.CHARTREUSE,
      viewerObject.viewer,
      'Dynamic line',
      false,
      2,
    );
  }
}

export default updatePolylineHeight;
