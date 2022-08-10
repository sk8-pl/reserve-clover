/* eslint-disable no-undef */
import { pickedEntityObject } from './variables';
import viewerObject from './viewer-variable';
import createPolyline from './create-polyline';

function updatePolylineHeightPolygone(collectionHeightPoints) {
  console.log(pickedEntityObject.arrayPoints);
  const myPointsHeight = new Cesium.EntityCollection();

  if (collectionHeightPoints.length > 1) {
    myPointsHeight.removeAll();
    collectionHeightPoints.forEach((e) => {
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

export default updatePolylineHeightPolygone;
