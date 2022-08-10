/* eslint-disable no-param-reassign */

function disableCameraMotion(state, viewer) {
  viewer.scene.screenSpaceCameraController.enableRotate = state;
  viewer.scene.screenSpaceCameraController.enableZoom = state;
  viewer.scene.screenSpaceCameraController.enableLook = state;
  viewer.scene.screenSpaceCameraController.enableTilt = state;
  viewer.scene.screenSpaceCameraController.enableTranslate = state;
}

export default disableCameraMotion;
