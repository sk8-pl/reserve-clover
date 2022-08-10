/* eslint-disable no-mixed-operators */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-bitwise */
/* eslint-disable no-use-before-define */
/* eslint-disable eqeqeq */
/* eslint-disable no-loop-func */
/* eslint-disable func-names */
/* eslint-disable new-cap */
/* eslint-disable radix */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-tabs */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-shadow */

import { useDispatch } from 'react-redux';
import { pickPolygon } from '../../store/grab-polygon/grab-polygon';
import store from '../../store';
import { sendJSON } from '../../helpers/server-sendPZ/sendDataJSON';
import disableCameraMotion from '../../helpers/map-helpers/disable-camera';
// -------------------------------------------------------------------------------------------------------------

import modeGeometry, {
  myPointsHeight, isPick, pickedEntityObject, nullHeightPZObject,
} from '../../helpers/map-helpers/variables';
import viewerObject from '../../helpers/map-helpers/viewer-variable';

import createPolyline from '../../helpers/map-helpers/create-polyline';

import drawHeightPoint from '../../helpers/map-helpers/draw-height-poiint';
import getHeight from '../../helpers/map-helpers/get-height';

import createCesiumPoint from '../../helpers/map-helpers/create-point';

let viewer = viewerObject.viewer;

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1YzBjNDg3Zi02MDk0LTQ3MjgtYmY5ZS00ZTMyYjU4OGNiNGIiLCJpZCI6ODUxNzgsImlhdCI6MTY0NjgyODA5OH0.01yvNBRR1KtT_G-Y5mda9mp-Sr6kdHkVNvb7cYDD3vM';

(function () {
  const OGCHelper = {};
  const loadXML = Cesium.loadXML === undefined ? Cesium.Resource.fetchXML : Cesium.loadXML;
  const loadArrayBuffer = Cesium.loadArrayBuffer === undefined ? Cesium.Resource.fetchArrayBuffer : Cesium.loadArrayBuffer;
  const loadImage = Cesium.loadImage === undefined ? Cesium.Resource.fetchImage : Cesium.loadImage;
  const intersectionRectangle = function (rectangle0, rectangle1) {
    const west = Math.max(rectangle0.west, rectangle1.west);
    const east = Math.min(rectangle0.east, rectangle1.east);
    const south = Math.max(rectangle0.south, rectangle1.south);
    const north = Math.min(rectangle0.north, rectangle1.north);
    let resultat;
    if ((east <= west) || (south >= north)) {
      resultat = undefined;
    } else {
      resultat = new Cesium.Rectangle(west, south, east, north);
    }
    return resultat;
  };

  OGCHelper.CRS = [{
    name: 'CRS:84',
    ellipsoid: Cesium.Ellipsoid.WGS84,
    firstAxeIsLatitude: false,
    tilingScheme: Cesium.GeographicTilingScheme,
    supportedCRS: 'urn:ogc:def:crs:OGC:2:84',
  }, {
    name: 'EPSG:4326',
    ellipsoid: Cesium.Ellipsoid.WGS84,
    firstAxeIsLatitude: true,
    tilingScheme: Cesium.GeographicTilingScheme,
    SupportedCRS: 'urn:ogc:def:crs:EPSG::4326',
  }, {
    name: 'EPSG:3857',
    ellipsoid: Cesium.Ellipsoid.WGS84,
    firstAxeIsLatitude: false,
    tilingScheme: Cesium.WebMercatorTilingScheme,
    SupportedCRS: 'urn:ogc:def:crs:EPSG::3857',
  }, {
    name: 'OSGEO:41001',
    ellipsoid: Cesium.Ellipsoid.WGS84,
    firstAxeIsLatitude: false,
    tilingScheme: Cesium.WebMercatorTilingScheme,
    SupportedCRS: 'urn:ogc:def:crs:EPSG::3857',
  }];

  OGCHelper.FormatImage = [{
    format: 'image/png',
    extension: 'png',
  }, {
    format: 'image/jpeg',
    extension: 'jpg',
  }, {
    format: 'image/jpeg',
    extension: 'jpeg',
  }, {
    format: 'image/gif',
    extension: 'gif',
  }, {
    format: 'image/png; mode=8bit',
    extension: 'png',
  }];

  OGCHelper.FormatArray = [{
    format: 'image/bil',

    postProcessArray(bufferIn, size, highest, lowest, offset) {
      let resultat;
      let viewerIn = new DataView(bufferIn);
      let littleEndianBuffer = new ArrayBuffer(size.height * size.width * 2);
      let viewerOut = new DataView(littleEndianBuffer);
      if (littleEndianBuffer.byteLength === bufferIn.byteLength) {
        let temp; let goodCell = 0;
        let somme = 0;
        for (let i = 0; i < littleEndianBuffer.byteLength; i += 2) {
          temp = viewerIn.getInt16(i, false) - offset;
          if (temp > lowest && temp < highest) {
            viewerOut.setInt16(i, temp, true);
            somme += temp;
            goodCell++;
          } else {
            let val = (goodCell === 0 ? 1 : somme / goodCell);
            viewerOut.setInt16(i, val, true);
          }
        }
        resultat = new Int16Array(littleEndianBuffer);
      }
      return resultat;
    },
  }];

  OGCHelper.WMSParser = {};
  OGCHelper.TMSParser = {};
  OGCHelper.WMTSParser = {};
  /**
   * parse wms,TMS or WMTS url from an url and a layer. request metadata information on server.
   *
   *
   * @param {String}
   *            description.layerName the name of the layer.
   * @param {String}
   *            [description.url] The URL of the server providing wms.
   * @param {String}
   *            [description.xml] the xml after requesting "getCapabilities"
   *            from web map server.
   * @param {String}
   *            [description.service] the type of service requested (WMS,TMS,WMTS). WMS is default
   *            from web map server.
   * @param {Object}
   *            [description.proxy] A proxy to use for requests. This object
   *            is expected to have a getURL function which returns the
   *            proxied URL, if needed.
   * @param {Number}
   *            [description.heightMapWidth] width  of a tile in pixels
   * @param {Number}
   *            [description.heightMapHeight] height of a tile in pixels
   * @param {Number}
   *            [description.offset] offset of the tiles (in meters)
   * @param {Number}
   *            [description.highest] highest altitude in the tiles (in meters)
   * @param {Number}
   *            [description.lowest] lowest altitude in the tiles (in meters)
   * @param {String}
   *            [description.styleName] name of the Style used for images.
   * @param {boolean}
   *            [description.hasStyledImage] indicates if the requested images are styled with SLD
   * @param {Boolean}
   *            [description.waterMask] indicates if a water mask will be
   *            displayed (experimental)
   * @param {Number}
   *            [description.maxLevel] maximum level to request
   * @param {Object}
   *            [description.formatImage] see OGCHelper.FormatImage
   * @param {Object}
   *            [description.formatArray] see OGCHelper.FormatArray
   * return a promise with:
   *	- ready : boolean which indicates that the parsing didn't have issue
   *	- [URLtemplateImage]: function which takes in parameters x,y,level and return the good URL template to request an image
   *	- [URLtemplateArray]: function which takes in parameters x,y,level and return the good URL template to request an typedArray
   *	- highest: integer indicates the highest elevation of the terrain provider
   *	- lowest: integer indicates the lowest elevation of the terrain provider
   *	- offset: integer indicates the offset of the terrain
   *	- hasStyledImage: boolean indicates if the images use a style (change the offset)
   *	- heightMapWidth: integer with of the hightMapTerrain
   *	- heightMapHeight: integer height of the hightMapTerrain
   *	- waterMask: boolean indicates if a water mask should be used
   *	- getTileDataAvailable: function determines whether data for a tile is available to be loaded
   *	- tilingScheme: the tiling scheme to use
   *	- [imageSize]: {width:integer, height:integer} dimension of the requested images
   */
  OGCHelper.parser = function (description = Cesium.defaultValue.EMPTY_OBJECT) {
    let resultat;
    switch (description.service) {
      case 'TMS':
        resultat = OGCHelper.TMSParser.generate(description);
        break;
      case 'WMTS':
        resultat = OGCHelper.WMTSParser.generate(description);
        break;
      default:
        resultat = OGCHelper.WMSParser.generate(description);
    }
    return resultat;
  };

  OGCHelper.WMSParser.generate = function (description = Cesium.defaultValue.EMPTY_OBJECT) {
    let resultat;
    if (Cesium.defined(description.url)) {
      let urlofServer = description.url;
      let index = urlofServer.lastIndexOf('?');
      if (index > -1) {
        urlofServer = urlofServer.substring(0, index);
      }
      let urlGetCapabilities = `${urlofServer
      }?SERVICE=WMS&REQUEST=GetCapabilities&tiled=true`;
      if (Cesium.defined(description.proxy)) {
        urlGetCapabilities = description.proxy.getURL(urlGetCapabilities);
      }
      resultat = loadXML(urlGetCapabilities).then((xml) => OGCHelper.WMSParser.getMetaDatafromXML(xml, description));
    } else if (Cesium.defined(description.xml)) {
      resultat = OGCHelper.WMSParser.getMetaDatafromXML(description.xml, description);
    } else {
      throw new Cesium.DeveloperError(
        'either description.url or description.xml are required.',
      );
    }
    return resultat;
  };

  OGCHelper.WMSParser.getMetaDatafromXML = function (xml, description) {
    if (!(xml instanceof XMLDocument)) {
      throw new Cesium.DeveloperError('xml must be a XMLDocument');
    }
    if (!Cesium.defined(description.layerName)) {
      throw new Cesium.DeveloperError(
        'description.layerName is required.',
      );
    }
    let resultat = {};
    let layerName = description.layerName;
    let maxLevel = Cesium.defaultValue(description.maxLevel, 11);
    let version;
    resultat.heightMapWidth = Cesium.defaultValue(description.heightMapWidth, 65);
    resultat.heightMapHeight = Cesium.defaultValue(description.heightMapHeight, resultat.heightMapWidth);
    let requestedSize = {
      width: 65,
      height: 65,
    };
    let CRS;
    resultat.formatImage = description.formatImage;
    resultat.formatArray = description.formatArray;
    resultat.tilingScheme = undefined;
    let firstAxeIsLatitude;
    let isNewVersion;
    resultat.ready = false;
    resultat.levelZeroMaximumGeometricError = undefined;
    resultat.waterMask = Cesium.defaultValue(description.waterMask, false);
    if (typeof (resultat.waterMask) !== 'boolean') {
      resultat.waterMask = false;
    }
    resultat.offset = Cesium.defaultValue(description.offset, 0);
    resultat.highest = Cesium.defaultValue(description.highest, 12000);
    resultat.lowest = Cesium.defaultValue(description.lowest, -500);
    let styleName = description.styleName;
    resultat.hasStyledImage = Cesium.defaultValue(description.hasStyledImage, typeof (description.styleName) === 'string');
    let versionNode = xml.querySelector('[version]');
    if (versionNode !== null) {
      version = versionNode.getAttribute('version');
      isNewVersion = /^1\.[3-9]\./.test(version);
    }

    let url = xml.querySelector('Request>GetMap OnlineResource').getAttribute('xlink:href');
    let index = url.indexOf('?');
    if (index > -1) {
      url = url.substring(0, index);
    }
    if (Cesium.defined(description.proxy)) {
      url = description.proxy.getURL(url);
    }

    let nodeFormats = xml.querySelectorAll('Request>GetMap>Format');

    if (!Cesium.defined(resultat.formatImage)) {
      for (let j = 0; j < nodeFormats.length && !Cesium.defined(resultat.formatArray); j++) {
        let OGCAvailables = OGCHelper.FormatArray.filter((elt) => elt.format === nodeFormats[j].textContent);
        if (OGCAvailables.length > 0) {
          resultat.formatArray = OGCAvailables[0];
        }
      }
    }
    if (Cesium.defined(resultat.formatArray)
          && typeof (resultat.formatArray.format) === 'string'
          && typeof (resultat.formatArray.postProcessArray) === 'function') {
      resultat.formatArray.terrainDataStructure = {
        heightScale: 1.0,
        heightOffset: 0,
        elementsPerHeight: 1,
        stride: 1,
        elementMultiplier: 256.0,
        isBigEndian: false,
        lowestEncodedHeight: 0,
        highestEncodedHeight: 10000,
      };
    } else {
      resultat.formatArray = undefined;
    }
    for (let j = 0; j < nodeFormats.length && !Cesium.defined(resultat.formatImage); j++) {
      let OGCAvailables = OGCHelper.FormatImage.filter((elt) => elt.format === nodeFormats[j].textContent);
      if (OGCAvailables.length > 0) {
        resultat.formatImage = OGCAvailables[0];
      }
    }
    if (Cesium.defined(resultat.formatImage)
          && typeof (resultat.formatImage.format) === 'string') {
      resultat.formatImage.terrainDataStructure = {
        heightScale: 1.0,
        heightOffset: 0,
        elementsPerHeight: 2,
        stride: 4,
        elementMultiplier: 256.0,
        isBigEndian: true,
        lowestEncodedHeight: 0,
        highestEncodedHeight: 10000,
      };
    } else {
      resultat.formatImage = undefined;
    }
    let layerNodes = xml
      .querySelectorAll("Layer[queryable='1'],Layer[queryable='true']");
    let layerNode;
    for (let m = 0; m < layerNodes.length && !Cesium.defined(layerNode); m++) {
      if (layerNodes[m].querySelector('Name').textContent === layerName) {
        layerNode = layerNodes[m];
        let fixedHeight = layerNode.getAttribute('fixedHeight');
        let fixedWidth = layerNode.getAttribute('fixedWidth');
        if (Cesium.defined(fixedHeight)) {
          fixedHeight = parseInt(fixedHeight);
          resultat.heightMapHeight = fixedHeight > 0 && fixedHeight < resultat.heightMapHeight ? fixedHeight : resultat.heightMapHeight;
          requestedSize.height = fixedHeight > 0 ? fixedHeight : requestedSize.height;
        }
        if (Cesium.defined(fixedWidth)) {
          fixedWidth = parseInt(fixedWidth);
          resultat.heightMapWidth = fixedWidth > 0 && fixedWidth < resultat.heightMapWidth ? fixedWidth : resultat.heightMapWidth;
          requestedSize.width = fixedWidth > 0 ? fixedWidth : requestedSize.width;
        }
      }
    }

    if (Cesium.defined(layerNode) && Cesium.defined(version)) {
      let found = false;
      for (let n = 0; n < OGCHelper.CRS.length && !found; n++) {
        let CRSSelected = OGCHelper.CRS[n];
        let referentialName = CRSSelected.name;
        let nodeBBox = layerNode.querySelector(`BoundingBox[SRS='${
          referentialName}'],BoundingBox[CRS='${
          referentialName}']`);

        if (nodeBBox !== null) {
          CRS = referentialName;
          firstAxeIsLatitude = CRSSelected.firstAxeIsLatitude;
          resultat.tilingScheme = new CRSSelected.tilingScheme({
            ellipsoid: CRSSelected.ellipsoid,
          });

          let west; let east; let south; let
            north;
          if (firstAxeIsLatitude && isNewVersion) {
            west = parseFloat(nodeBBox.getAttribute('miny'));
            east = parseFloat(nodeBBox.getAttribute('maxy'));
            south = parseFloat(nodeBBox.getAttribute('minx'));
            north = parseFloat(nodeBBox.getAttribute('maxx'));
          } else {
            west = parseFloat(nodeBBox.getAttribute('minx'));
            east = parseFloat(nodeBBox.getAttribute('maxx'));
            south = parseFloat(nodeBBox.getAttribute('miny'));
            north = parseFloat(nodeBBox.getAttribute('maxy'));
          }
          let rectReference = new Cesium.Rectangle(west, south, east, north);
          resultat.getTileDataAvailable = function (x, y, level) {
            let retour = true;
            let rectangleCalcul = resultat.tilingScheme.tileXYToNativeRectangle(x, y, level);
            if (level < maxLevel) {
              let scratchRectangle = intersectionRectangle(rectReference, rectangleCalcul);
              retour = Cesium.defined(scratchRectangle);
            }
            return true;
          };
          found = true;
        }
      }
      if (Cesium.defined(styleName)) {
        let styleNodes = layerNode.querySelectorAll('Style>Name');
        let styleFound = false;
        for (let z = 0; z < styleNodes.length && !styleFound; z++) {
          if (styleName === styleNodes[z].textContent) {
            styleFound = true;
          }
        }
        if (!styleFound) {
          styleName = undefined;
        }
      }
      let tileSets = xml.querySelectorAll('VendorSpecificCapabilities>TileSet');
      let out = false;
      for (let q = 0; q < tileSets.length && !out; q++) {
        let isGoodSRS = tileSets[q].querySelector(`BoundingBox[SRS='${
          CRS}'],BoundingBox[CRS='${
          CRS}']`) !== null;
        let isGoodLayer = tileSets[q].querySelector('Layers').textContent === layerName;
        if (isGoodLayer && isGoodSRS) {
          requestedSize.width = parseInt(tileSets[q].querySelector('Width').textContent);
          requestedSize.height = parseInt(tileSets[q].querySelector('Height').textContent);
          out = true;
        }
      }

      resultat.ready = found
              && (Cesium.defined(resultat.formatImage) || Cesium.defined(resultat.formatArray))
              && Cesium.defined(version);
    }

    if (resultat.ready) {
      let URLtemplate = `${url}?SERVICE=WMS&REQUEST=GetMap&layers=${layerName}&version=${version}&bbox=`;
      if (isNewVersion && firstAxeIsLatitude) {
        URLtemplate += '{south},{west},{north},{east}';
      } else {
        URLtemplate += '{west},{south},{east},{north}';
      }
      URLtemplate += `&crs=${CRS}&srs=${CRS}`;

      if (resultat.formatImage) {
        let URLtemplateImage = `${URLtemplate}&format=${resultat.formatImage.format}&width=${requestedSize.width}&height=${requestedSize.height}`;
        if (Cesium.defined(styleName)) {
          URLtemplateImage += `&styles=${styleName}&style=${styleName}`;
        }
        resultat.URLtemplateImage = function () {
          return URLtemplateImage;
        };
        resultat.imageSize = requestedSize;
      }

      if (resultat.formatArray) {
        let URLtemplateArray = `${URLtemplate}&format=${resultat.formatArray.format}&width=${
          resultat.heightMapWidth}&height=${resultat.heightMapHeight}`;
        resultat.URLtemplateArray = function () {
          return URLtemplateArray;
        };
      }
    }
    return resultat;
  };

  OGCHelper.TMSParser.generate = function (description = Cesium.defaultValue.EMPTY_OBJECT) {
    let resultat;
    if (Cesium.defined(description.url)) {
      resultat = loadXML(description.url).then((xml) => OGCHelper.TMSParser.parseXML(xml, description));
    } else if (Cesium.defined(description.xml)) {
      resultat = OGCHelper.TMSParser.parseXML(description.xml, description);
    } else {
      throw new Cesium.DeveloperError(
        'either description.url or description.xml are required.',
      );
    }
    return resultat;
  };

  OGCHelper.TMSParser.parseXML = function (xml, description) {
    if (!(xml instanceof XMLDocument)) {
      throw new Cesium.DeveloperError('xml must be a XMLDocument');
    }
    let resultat;
    if (xml.querySelector('TileMapService') != null) {
      if (!Cesium.defined(description.layerName)) {
        throw new Cesium.DeveloperError('layerName is required.');
      }
      let mapServiceNodes = [].slice.apply(xml.querySelectorAll(`TileMap[title='${description.layerName}']`));
      let promises = mapServiceNodes.map((elt) => {
        let url = elt.getAttribute('href');
        if (Cesium.defined(description.proxy)) {
          url = description.proxy.getURL(url);
        }
        return Cesium.when(loadXML(url), (xml) => OGCHelper.TMSParser.getMetaDatafromXML(xml, description));
      });
      let promise = Cesium.when.all(promises).then((tabResult) => {
        let retour;
        for (let i = 0; i < tabResult.length && !Cesium.defined(retour); i++) {
          if (Cesium.defined(tabResult[i])) {
            retour = tabResult[i];
          }
        }
        return retour;
      });
      resultat = promise.then((retour) => retour);
    } else {
      resultat = OGCHelper.TMSParser.getMetaDatafromXML(xml, description);
    }
    return resultat;
  };

  OGCHelper.TMSParser.getMetaDatafromXML = function (xml, description) {
    let resultat = {};
    resultat.ready = false;
    resultat.heightMapWidth = Cesium.defaultValue(description.heightMapWidth, 65);
    resultat.heightMapHeight = Cesium.defaultValue(description.heightMapHeight, resultat.heightMapWidth);
    let maxLevel = Cesium.defaultValue(description.maxLevel, 11);
    let proxy = description.proxy;
    resultat.hasStyledImage = Cesium.defaultValue(description.hasStyledImage, typeof (description.styleName) === 'string');
    resultat.waterMask = Cesium.defaultValue(description.waterMask, false);
    if (typeof (resultat.waterMask) != 'boolean') {
      resultat.waterMask = false;
    }
    resultat.offset = Cesium.defaultValue(description.offset, 0);
    resultat.highest = Cesium.defaultValue(description.highest, 12000);
    resultat.lowest = Cesium.defaultValue(description.lowest, -500);

    let srs = xml.querySelector('SRS').textContent;
    let goodCRS = OGCHelper.CRS.filter((elt) => elt.name === srs);
    if (goodCRS.length > 0) {
      resultat.tilingScheme = new goodCRS[0].tilingScheme({
        ellipsoid: goodCRS[0].ellipsoid,
      });
    }

    let format = xml.querySelector('TileFormat');
    let goodFormatImage = OGCHelper.FormatImage.filter((elt) => elt.extension == format.getAttribute('extension'));
    if (goodFormatImage.length > 0) {
      resultat.formatImage = goodFormatImage[0];
      resultat.imageSize = {};
      resultat.imageSize.width = parseInt(format.getAttribute('width'));
      resultat.imageSize.height = parseInt(format.getAttribute('height'));
    }

    let tilsetsNode = [].slice.call(xml.querySelectorAll('TileSets>TileSet'));
    let tileSets = [];

    if (Cesium.defined(resultat.formatImage)) {
      tileSets = tilsetsNode.map((tileSet) => {
        let url = `${tileSet.getAttribute('href')}/{x}/{tmsY}.${resultat.formatImage.extension}`;
        if (Cesium.defined(proxy)) {
          url = proxy.getURL(url);
        }
        let level = parseInt(tileSet.getAttribute('order'));
        return {
          url,
          level,
        };
      });
      tileSets.sort((a, b) => a.level - b.level);
      if (tileSets.length > 0) {
        resultat.tileSets = tileSets;
      }
    }

    if (!Cesium.defined(resultat.tileSets) || !Cesium.defined(resultat.formatImage) || !Cesium.defined(resultat.tilingScheme)) {
      resultat = undefined;
    } else {
      resultat.URLtemplateImage = function (x, y, level) {
        let retour = '';
        if (level < tileSets.length) {
          retour = tileSets[level].url;
        }
        return retour;
      };
      let boundingBoxNode = xml.querySelector('BoundingBox');
      let miny = parseFloat(boundingBoxNode.getAttribute('miny'));
      let maxy = parseFloat(boundingBoxNode.getAttribute('maxy'));
      let minx = parseFloat(boundingBoxNode.getAttribute('minx'));
      let maxx = parseFloat(boundingBoxNode.getAttribute('maxx'));
      let limites = new Cesium.Rectangle(minx, miny, maxx, maxy);
      resultat.getTileDataAvailable = function (x, y, level) {
        let rect = resultat.tilingScheme.tileXYToNativeRectangle(x, y, level);
        let scratchRectangle = intersectionRectangle(limites, rect);
        return Cesium.defined(scratchRectangle) && level < maxLevel && level < tileSets.length;
      };
      resultat.ready = true;
    }
    return resultat;
  };

  OGCHelper.WMTSParser.generate = function (description = Cesium.defaultValue.EMPTY_OBJECT) {
    let resultat;
    if (Cesium.defined(description.url)) {
      let urlofServer = description.url;
      let index = urlofServer.lastIndexOf('?');
      if (index > -1) {
        urlofServer = urlofServer.substring(0, index);
      }
      let urlGetCapabilities = `${urlofServer
      }?REQUEST=GetCapabilities`;
      if (Cesium.defined(description.proxy)) {
        urlGetCapabilities = description.proxy.getURL(urlGetCapabilities);
      }
      resultat = loadXML(urlGetCapabilities).then((xml) => OGCHelper.WMTSParser.getMetaDatafromXML(xml, description));
    } else if (Cesium.defined(description.xml)) {
      resultat = OGCHelper.WMTSParser.getMetaDatafromXML(description.xml, description);
    } else {
      throw new Cesium.DeveloperError(
        'either description.url or description.xml are required.',
      );
    }
    return resultat;
  };

  OGCHelper.WMTSParser.getMetaDatafromXML = function (xml, description) {
    if (!(xml instanceof XMLDocument)) {
      throw new Cesium.DeveloperError('xml must be a XMLDocument');
    }

    let resultat = {};
    let layerName = description.layerName;
    resultat.ready = false;
    resultat.heightMapWidth = Cesium.defaultValue(description.heightMapWidth, 65);
    resultat.heightMapHeight = Cesium.defaultValue(description.heightMapHeight, resultat.heightMapWidth);
    let maxLevel = Cesium.defaultValue(description.maxLevel, 12);
    let proxy = description.proxy;
    let styleName = description.styleName;
    resultat.hasStyledImage = Cesium.defaultValue(description.hasStyledImage, typeof (description.styleName) === 'string');
    resultat.waterMask = Cesium.defaultValue(description.waterMask, false);
    if (typeof (resultat.waterMask) != 'boolean') {
      resultat.waterMask = false;
    }
    resultat.offset = Cesium.defaultValue(description.offset, 0);
    resultat.highest = Cesium.defaultValue(description.highest, 12000);
    resultat.lowest = Cesium.defaultValue(description.lowest, -500);
    let template;
    let listTileMatrixSetLinkNode = [];

    let urlKVP; let
      urlRESTful;
    let formatImage;
    let nodesGetOperation = [].slice.call(xml.querySelectorAll('Operation[name="GetTile"] HTTP Get'));
    let correctEncoding = nodesGetOperation.map((elt) => {
      let val = elt.querySelector('Value').textContent;
      let retour;
      if (val === 'KVP') {
        retour = {
          node: elt,
          type: 'KVP',
        };
      }
      if (val === 'RESTful') {
        retour = {
          node: elt,
          type: 'RESTful',
        };
      }
      return retour;
    }).filter((elt) => Cesium.defined(elt));

    for (let i = 0; i < correctEncoding.length; i++) {
      let node = correctEncoding[i];
      if (node.type === 'RESTful' && !Cesium.defined(urlRESTful)) {
        urlRESTful = node.node.getAttribute('xlink:href');
        if (Cesium.defined(proxy)) {
          urlRESTful = proxy.getURL(urlRESTful);
        }
      }
      if (node.type === 'KVP' && !Cesium.defined(urlKVP)) {
        urlKVP = node.node.getAttribute('xlink:href');
        if (Cesium.defined(proxy)) {
          urlKVP = proxy.getURL(urlKVP);
        }
      }
    }

    let nodeIdentifiers = xml.querySelectorAll('Contents>Layer>Identifier');
    let layerNode;
    for (let i = 0; i < nodeIdentifiers.length && !Cesium.defined(layerNode); i++) {
      if (layerName === nodeIdentifiers[i].textContent) {
        layerNode = nodeIdentifiers[i].parentNode;
      }
    }

    if (Cesium.defined(layerNode)) {
      let styleNodes = layerNode.querySelectorAll('Style');
      let defaultStyle;
      let selectedStyle;

      for (let i = 0; i < styleNodes.length; i++) {
        let style = styleNodes[i].querySelector('Identifier').textContent;
        if (styleNodes[i].getAttribute('isDefault') != null) {
          defaultStyle = style;
        }
        if (style === styleName) {
          selectedStyle = style;
        }
      }
      if (!Cesium.defined(styleName) || styleName != selectedStyle) {
        styleName = Cesium.defaultValue(defaultStyle, '');
      }

      let nodeFormats = [].slice.call(layerNode.querySelectorAll('Format'));
      for (let l = 0; l < OGCHelper.FormatImage.length
              && !Cesium.defined(formatImage); l++) {
        let validFormats = nodeFormats.filter((elt) => elt.textContent === OGCHelper.FormatImage[l].format);
        if (validFormats.length > 0) {
          formatImage = OGCHelper.FormatImage[l];
        }
      }
      listTileMatrixSetLinkNode = layerNode.querySelectorAll('TileMatrixSetLink');
    }

    let nodeMatrixSetIds = [].slice.call(xml.querySelectorAll('TileMatrixSet>Identifier'));
    for (let a = 0; a < listTileMatrixSetLinkNode.length && !resultat.ready; a++) {
      let matrixSetLinkNode = listTileMatrixSetLinkNode[a];
      let tileMatrixSetLinkName = matrixSetLinkNode.querySelector('TileMatrixSet').textContent;
      let tileMatrixSetNode;
      let CRSSelected;

      for (let i = 0; i < nodeMatrixSetIds.length && !Cesium.defined(tileMatrixSetNode); i++) {
        if (nodeMatrixSetIds[i].textContent === tileMatrixSetLinkName) {
          tileMatrixSetNode = nodeMatrixSetIds[i].parentNode;
        }
      }

      let supportedCRS = tileMatrixSetNode.querySelector('SupportedCRS').textContent;
      for (let n = 0; n < OGCHelper.CRS.length && !Cesium.defined(CRSSelected); n++) {
        if (OGCHelper.CRS[n].SupportedCRS === supportedCRS) {
          CRSSelected = OGCHelper.CRS[n];
        }
      }

      if (Cesium.defined(CRSSelected)) {
        let tileSets;

        let nodeTileSets = [].slice.call(tileMatrixSetNode.querySelectorAll('TileMatrix'));
        tileSets = nodeTileSets.map((noeud) => {
          let id = noeud.querySelector('Identifier').textContent;
          let maxWidth = parseInt(noeud.querySelector('MatrixWidth').textContent);
          let maxHeight = parseInt(noeud.querySelector('MatrixHeight').textContent);
          let tileWidth = parseInt(noeud.querySelector('TileWidth').textContent);
          let tileHeight = parseInt(noeud.querySelector('TileHeight').textContent);
          let scaleDenominator = parseFloat(noeud.querySelector('ScaleDenominator').textContent);
          return {
            id,
            maxWidth,
            maxHeight,
            scaleDenominator,
            complete: false,
            tileWidth,
            tileHeight,
          };
        });

        tileSets.sort((a, b) => b.scaleDenominator - a.scaleDenominator);
        listTileMatrixLimits = matrixSetLinkNode.querySelectorAll('TileMatrixSetLimits>TileMatrixLimits');
        for (let t = 0; t < tileSets.length; t++) {
          let tile = tileSets[t];
          for (let w = 0; w < listTileMatrixLimits.length; w++) {
            let nodeLink = listTileMatrixLimits[w];
            if (tile.id === nodeLink.querySelector('TileMatrix').textContent) {
              tile.minTileRow = parseInt(nodeLink.querySelector('MinTileRow').textContent);
              tile.maxTileRow = parseInt(nodeLink.querySelector('MaxTileRow').textContent);
              tile.minTileCol = parseInt(nodeLink.querySelector('MinTileCol').textContent);
              tile.maxTileCol = parseInt(nodeLink.querySelector('MaxTileCol').textContent);
              tile.complete = true;
              tileSets[t] = tile;
            }
          }
        }

        if (tileSets.length > 0) {
          resultat.tilingScheme = new CRSSelected.tilingScheme({
            ellipsoid: CRSSelected.ellipsoid,
            numberOfLevelZeroTilesX: tileSets[0].maxWidth,
            numberOfLevelZeroTilesY: tileSets[0].maxHeight,
          });
          let resourceURL = layerNode.querySelector(`ResourceURL[format='${formatImage.format}']`);

          if (resourceURL != null) {
            template = resourceURL.getAttribute('template').replace('{TileRow}', '{y}').replace('{TileCol}', '{x}').replace('{Style}', styleName)
              .replace('{TileMatrixSet}', tileMatrixSetLinkName)
              .replace('{layer}', layerName)
              .replace('{infoFormatExtension}', formatImage.extension);
          } else if (Cesium.defined(urlKVP)) {
            template = `${urlKVP}service=WMTS&request=GetTile&version=1.0.0&layer=${layerName}&style=${styleName}&format=${formatImage.format}&TileMatrixSet=${tileMatrixSetLinkName}&TileMatrix={TileMatrix}&TileRow={y}&TileCol={x}`;
          }

          if (Cesium.defined(template)) {
            resultat.getTileDataAvailable = function (x, y, level) {
              let retour = false;
              if (level < maxLevel && level < tileSets.length) {
                let tile = tileSets[level];
                if (tile.complete) {
                  retour = (y <= tile.maxTileRow && y >= tile.minTileRow) && (x <= tile.maxTileCol && x >= tile.minTileCol);
                } else {
                  retour = x < tile.maxWidth && y < tile.maxHeight;
                }
              }
              return retour;
            };
            resultat.URLtemplateImage = function (x, y, level) {
              let retour = '';
              if (resultat.getTileDataAvailable(x, y, level)) {
                let tile = tileSets[level];
                retour = template.replace('{TileMatrix}', tile.id);
              }
              return retour;
            };

            let imageSize = {
              width: tileSets[0].tileWidth,
              height: tileSets[0].tileHeight,
            };
            let checkSize = tileSets.filter((elt) => elt.tileWidth != imageSize.width || elt.tileHeight != imageSize.height);
            if (checkSize.length == 0) {
              resultat.imageSize = imageSize;
            }
            resultat.ready = true;
          }
        }
      }
    }
    return resultat;
  };

  /**
   * A {@link TerrainProvider} that produces geometry by tessellating height
   * maps retrieved from a geoserver terrain server.
   *
   * @alias GeoserverTerrainProvider
   * @constructor
   *
   * @param {String}
   *            description.url The URL of the geoserver terrain server.
   * @param {String}
   *            description.layerName The layers to include, separated by
   *            commas.
   * @param {Proxy}
   *            [description.proxy] A proxy to use for requests. This object
   *            is expected to have a getURL function which returns the
   *            proxied URL, if needed.
   * @param {Credit|String}
   *            [description.credit] A credit for the data source, which is
   *            displayed on the canvas.
   * @param {Number}
   *            [description.heightMapWidth] width and height of the tiles
   * @param {Number}
   *            [description.maxLevel] max level of tiles
   * @param {String}
   *            [description.service] type of service to use (WMS, TMS or WMTS)
   * @param {String}
   *            [description.xml] the xml after requesting "getCapabilities".
   * @see TerrainProvider
   */
  let GeoserverTerrainProvider = function GeoserverTerrainProvider(description) {
    if (!Cesium.defined(description)) {
      throw new Cesium.DeveloperError('description is required.');
    }
    let errorEvent = new Cesium.Event();

    let credit = description.credit;
    if (typeof credit === 'string') {
      credit = new Cesium.Credit(credit);
    }

    this.ready = false;
    this._readyPromise = Cesium.when.defer();

    Object.defineProperties(this, {
      errorEvent: {
        get() {
          return errorEvent;
        },
      },
      credit: {
        get() {
          return credit;
        },
      },
      hasVertexNormals: {
        get() {
          return false;
        },
      },
      /**
           * Gets a promise that resolves to true when the provider is ready for use.
           * @memberof CesiumTerrainProvider.prototype
           * @type {Promise.<Boolean>}
           * @readonly
           */
      readyPromise: {
        get() {
          return this._readyPromise.promise;
        },
      },
    });
    let promise = OGCHelper.parser(description);
    TerrainParser(promise, this);
  };

  GeoserverTerrainProvider.arrayToHeightmapTerrainData = function (arrayBuffer, limitations, size, formatArray, hasWaterMask, childrenMask) {
    if (typeof (size) == 'number') {
      size = {
        width: size,
        height: size,
      };
    }
    let heightBuffer = formatArray.postProcessArray(
      arrayBuffer,
      size,
      limitations.highest,
      limitations.lowest,
      limitations.offset,
    );
    if (!Cesium.defined(heightBuffer)) {
      throw new Cesium.DeveloperError('no good size');
    }
    let optionsHeihtmapTerrainData = {
      buffer: heightBuffer,
      width: size.width,
      height: size.height,
      childTileMask: childrenMask,
      structure: formatArray.terrainDataStructure,
    };
    if (hasWaterMask) {
      let waterMask = new Uint8Array(
        heightBuffer.length,
      );
      for (let i = 0; i < heightBuffer.length; i++) {
        if (heightBuffer[i] <= 0) {
          waterMask[i] = 255;
        }
      }
      optionsHeihtmapTerrainData.waterMask = waterMask;
    }
    return new Cesium.HeightmapTerrainData(optionsHeihtmapTerrainData);
  };

  GeoserverTerrainProvider.imageToHeightmapTerrainData = function (image, limitations, size, hasWaterMask, childrenMask, hasStyledImage) {
    if (typeof (size) == 'number') {
      size = {
        width: size,
        height: size,
      };
    }
    let dataPixels = Cesium.getImagePixels(image, size.width, size.height);
    let waterMask = new Uint8Array(dataPixels.length / 4);
    let buffer = new Int16Array(dataPixels.length / 4);
    let goodCell = 0;
    let somme = 0;
    for (let i = 0; i < dataPixels.length; i += 4) {
      let msb = dataPixels[i];
      let lsb = dataPixels[i + 1];
      let isCorrect = dataPixels[i + 2] > 128;
      let valeur = (msb << 8 | lsb) - limitations.offset - 32768;
      if (valeur > limitations.lowest && valeur < limitations.highest && (isCorrect || hasStyledImage)) {
        buffer[i / 4] = valeur;
        somme += valeur;
        goodCell++;
      } else {
        buffer[i / 4] = (goodCell == 0 ? 0 : somme / goodCell);
      }
    }

    let optionsHeihtmapTerrainData = {
      buffer,
      width: size.width,
      height: size.height,
      childTileMask: childrenMask,
      structure: {
        heightScale: 1.0,
        heightOffset: 0.0,
        elementsPerHeight: 1,
        stride: 1,
        elementMultiplier: 256.0,
        isBigEndian: false,
      },
    };

    if (hasWaterMask) {
      let waterMask = new Uint8Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        if (buffer[i] <= 0) {
          waterMask[i] = 255;
        }
      }
      optionsHeihtmapTerrainData.waterMask = waterMask;
    }
    return new Cesium.HeightmapTerrainData(optionsHeihtmapTerrainData);
  };

  function TerrainParser(promise, provider) {
    Cesium.when(promise, (resultat) => {
      if (Cesium.defined(resultat) && (resultat.ready)) {
        resultat.levelZeroMaximumGeometricError = Cesium.TerrainProvider.getEstimatedLevelZeroGeometricErrorForAHeightmap(
          resultat.tilingScheme.ellipsoid,
          resultat.heightMapWidth,
          resultat.tilingScheme.getNumberOfXTilesAtLevel(0),
        );
        if (Cesium.defined(resultat.URLtemplateImage)) {
          resultat.getHeightmapTerrainDataImage = function (x, y, level) {
            let retour;
            if (!isNaN(x + y + level)) {
              let urlArray = templateToURL(resultat.URLtemplateImage(x, y, level), x, y, level, provider);
              let limitations = {
                highest: resultat.highest,
                lowest: resultat.lowest,
                offset: resultat.offset,
              };
              let hasChildren = terrainChildrenMask(x, y, level, provider);
              let promise = loadImage(urlArray);
              if (Cesium.defined(promise)) {
                retour = Cesium.when(promise, (image) => GeoserverTerrainProvider.imageToHeightmapTerrainData(image, limitations, {
                  width: resultat.heightMapWidth,
                  height: resultat.heightMapHeight,
                }, resultat.waterMask, hasChildren, resultat.hasStyledImage)).otherwise(() => new Cesium.HeightmapTerrainData({
                  buffer: new Uint16Array(
                    resultat.heightMapWidth
                                          * resultat.heightMapHeight,
                  ),
                  width: resultat.heightMapWidth,
                  height: resultat.heightMapHeight,
                  childTileMask: hasChildren,
                  waterMask: new Uint8Array(resultat.heightMapWidth
                                          * resultat.heightMapHeight),
                  structure: resultat.formatImage.terrainDataStructure,
                }));
              }
            }
            return retour;
          };
        }

        if (Cesium.defined(resultat.URLtemplateArray)) {
          resultat.getHeightmapTerrainDataArray = function (x, y, level) {
            let retour;
            if (!isNaN(x + y + level)) {
              let urlArray = templateToURL(resultat.URLtemplateArray(x, y, level), x, y, level, provider);
              let limitations = {
                highest: resultat.highest,
                lowest: resultat.lowest,
                offset: resultat.offset,
              };
              let hasChildren = terrainChildrenMask(x, y, level, provider);

              let promise = loadArrayBuffer(urlArray);
              if (Cesium.defined(promise)) {
                retour = Cesium.when(
                  promise,
                  (arrayBuffer) => GeoserverTerrainProvider.arrayToHeightmapTerrainData(arrayBuffer, limitations, {
                    width: resultat.heightMapWidth,
                    height: resultat.heightMapHeight,
                  }, resultat.formatArray, resultat.waterMask, hasChildren),
                ).otherwise(
                  () => {
                    if (Cesium.defined(resultat.getHeightmapTerrainDataImage)) {
                      return resultat.getHeightmapTerrainDataImage(x, y, level);
                    }
                    return new Cesium.HeightmapTerrainData({
                      buffer: new Uint16Array(
                        resultat.heightMapWidth
                                                  * resultat.heightMapHeight,
                      ),
                      width: resultat.heightMapWidth,
                      height: resultat.heightMapHeight,
                      childTileMask: hasChildren,
                      waterMask: new Uint8Array(resultat.heightMapWidth
                                                  * resultat.heightMapHeight),
                      structure: resultat.formatImage.terrainDataStructure,
                    });
                  },
                );
              }
            }
            return retour;
          };
        }

        provider.getLevelMaximumGeometricError = function (level) {
          return resultat.levelZeroMaximumGeometricError / (1 << level);
        };

        provider.requestTileGeometry = function (x, y, level) {
          let retour;
          if (Cesium.defined(resultat.getHeightmapTerrainDataArray)) {
            retour = resultat.getHeightmapTerrainDataArray(x, y, level);
          } else if (Cesium.defined(resultat.getHeightmapTerrainDataImage)) {
            retour = resultat.getHeightmapTerrainDataImage(x, y, level);
          }
          return retour;
        };

        Object.defineProperties(provider, {
          tilingScheme: {
            get() {
              return resultat.tilingScheme;
            },
          },
          ready: {
            get() {
              return resultat.ready;
            },
          },
          hasWaterMask: {
            get() {
              return resultat.waterMask;
            },
          },
          heightMapHeight: {
            get() {
              return resultat.heightMapHeight;
            },
          },
          heightMapWidth: {
            get() {
              return resultat.heightMapWidth;
            },
          },
          getTileDataAvailable: {
            get() {
              return resultat.getTileDataAvailable;
            },
          },
        });
      }
      provider._readyPromise.resolve(resultat.ready);
    });
  }

  function templateToURL(urlParam, x, y, level, provider) {
    let rect = provider.tilingScheme.tileXYToNativeRectangle(x, y, level);
    let xSpacing = (rect.east - rect.west) / (provider.heightMapWidth - 1);
    let ySpacing = (rect.north - rect.south) / (provider.heightMapHeight - 1);
    rect.west -= xSpacing * 0.5;
    rect.east += xSpacing * 0.5;
    rect.south -= ySpacing * 0.5;
    rect.north += ySpacing * 0.5;

    let yTiles = provider.tilingScheme.getNumberOfYTilesAtLevel(level);
    let tmsY = (yTiles - y - 1);

    return urlParam.replace('{south}', rect.south).replace('{north}', rect.north).replace('{west}', rect.west)
      .replace('{east}', rect.east)
      .replace('{x}', x)
      .replace('{y}', y)
      .replace('{tmsY}', tmsY);
  }

  function terrainChildrenMask(x, y, level, provider) {
    let mask = 0;
    let childLevel = level + 1;
    mask |= provider.getTileDataAvailable(2 * x, 2 * y, childLevel) ? 1 : 0;
    mask |= provider.getTileDataAvailable(2 * x + 1, 2 * y, childLevel) ? 2 : 0;
    mask |= provider.getTileDataAvailable(2 * x, 2 * y + 1, childLevel) ? 4 : 0;
    mask |= provider.getTileDataAvailable(2 * x + 1, 2 * y + 1, childLevel) ? 8 : 0;
    return mask;
  }

  Cesium.GeoserverTerrainProvider = GeoserverTerrainProvider;
}());

// export const isPick = {
//   value: false,
//   polygonVertices: [],
// };

export default function initialGeo() {
  const GeoserverterrainProvider = new Cesium.GeoserverTerrainProvider({
    service: 'WMS',
    heightMapWidth: 64,
    HeightMapHeight: 64,
    offset: 0,
    highest: 7000,
    lowest: 0,
    maxLevel: 11,
    formatImage: { format: 'image/png', extension: 'png' },
    hasStyledImage: true,
    url: 'http://maps.int-sys.net:88/geoserver/elevation/wms',
    layerName: 'srtm-30',
    styleName: 'SRTM2Color',
    waterMask: true,
    formatArray: {
      format: 'image/bil',

      postProcessArray(bufferIn, size, highest, lowest, offset) {
        let resultat;
        let viewerIn = new DataView(bufferIn);
        let littleEndianBuffer = new ArrayBuffer(size.height * size.width * 2);
        let viewerOut = new DataView(littleEndianBuffer);
        if (littleEndianBuffer.byteLength === bufferIn.byteLength) {
        // time to switch bytes!!
          let temp; let goodCell = 0; let
            somme = 0;
          for (let i = 0; i < littleEndianBuffer.byteLength; i += 2) {
            temp = viewerIn.getInt16(i, false) - offset;
            if (temp > lowest && temp < highest) {
              viewerOut.setInt16(i, temp, true);
              somme += temp;
              goodCell++;
            } else {
              let val = (goodCell == 0 ? 1 : somme / goodCell);
              viewerOut.setInt16(i, val, true);
            }
          }
          resultat = new Int16Array(littleEndianBuffer);
        }
        return resultat;
      },
    },
  });
  viewerObject.viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: GeoserverterrainProvider,
  });

  viewerObject.viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(53.78455094799108, 56.480126164814045, 1000),
  });
}

//------------------------------------------------------------------------------------------------------------------------------------------------------

let myPoints = new Cesium.EntityCollection();
let waypointPosition;
let routeEntity;
let arrayCollectionsHeight = [new Cesium.EntityCollection()];
let currIndexCollectionHeight = 0;

export function setHundlerWeather() {
  let handler = new Cesium.ScreenSpaceEventHandler(viewerObject.viewer.canvas);

  handler.setInputAction((click) => {
    const position = click.position;
    console.log(position);
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
}

function createDraggableWaypoint(waypointPosition, viewer) {
  let picked = false;
  let pickedEntity;

  let positionCallback = (time, result) => waypointPosition.clone(result);

  let positionCBP = new Cesium.CallbackProperty(positionCallback, false);

  let myPoint = createCesiumPoint(
    positionCBP,
    15,
    Cesium.Color.RED,
    Cesium.Color.WHITE,
  );

  myPoint.endPosition = waypointPosition;
  myPoint._name = 'Draggable_Point';
  myPoint.add;

  viewerObject.viewer.entities.add(myPoint);

  let handler = new Cesium.ScreenSpaceEventHandler(viewerObject.viewer.canvas);

  handler.setInputAction((click) => {
    let pickedObject = viewerObject.viewer.scene.pick(click.position);
    if (Cesium.defined(pickedObject) && pickedObject.id === myPoint) {
      picked = true;
      disableCameraMotion(false, viewerObject.viewer);
      pickedEntity = pickedObject.id;
      pickedEntity.point.pixelSize = 20;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

  handler.setInputAction((movement) => {
    if (!picked) {
      return;
    }
    waypointPosition = viewerObject.viewer.camera.pickEllipsoid(
      movement.endPosition,
      viewerObject.viewer.scene.globe.ellipsoid,
    );
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  handler.setInputAction((movement) => {
    if (myPoint.endPosition != waypointPosition) {
      const idPoint = myPoint.id;
      const entityDeleted = viewerObject.viewer.entities.getById(`${idPoint}heightPoint`);
      viewerObject.viewer.entities.remove(entityDeleted);
      getHeight(waypointPosition, idPoint, false, false);
    }

    picked = false;
    disableCameraMotion(true, viewerObject.viewer);

    myPoint.endPosition = waypointPosition;
    // updateFlightData();
    myPoint.point.pixelSize = 15;
  }, Cesium.ScreenSpaceEventType.LEFT_UP);

  return myPoint;
}

function createWaypoint(waypointPosition, viewer) {
  let entity = createDraggableWaypoint(waypointPosition, viewer);
  myPoints.add(entity);
  if (myPoints._entities._array.length > 1) {
    createPolyline(
      myPoints,
      Cesium.Color.BLUE,
      viewer,
      'Dynamic line',
      true,
      5,
    );
  }
  return entity;
}

// ------------------------------------------------------------------------------------------------------ polygone mode

export function drawPolygones() {
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

  // const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  modeGeometry.mode = new Cesium.ScreenSpaceEventHandler(viewerObject.viewer.canvas);

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
    viewerObject.viewer.entities.add(myPoint);

    const handlerPoint = new Cesium.ScreenSpaceEventHandler(viewerObject.viewer.canvas);

    handlerPoint.setInputAction((click) => {
      const pickedObject = viewerObject.viewer.scene.pick(click.position);
      if (Cesium.defined(pickedObject) && pickedObject.id === myPoint) {
        picked = true;
        disableCameraMotion(false, viewerObject.viewer);
        pickedEntity = pickedObject.id;
        pickedEntity.point.pixelSize = 20;
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handlerPoint.setInputAction((movement) => {
      if (!picked) {
        return;
      }
      waypointPosition = viewerObject.viewer.camera.pickEllipsoid(
        movement.endPosition,
        viewerObject.viewer.scene.globe.ellipsoid,
      );
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handlerPoint.setInputAction((movement) => {
      picked = false;
      disableCameraMotion(true, viewerObject.viewer);

      myPoint.point.pixelSize = 15;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);

    return myPoint;
  }

  function createPoint(waypointPosition, viewer) {
    const entity = createDraggableWaypoint(waypointPosition, viewer);
    return entity;
  }

  function drawShape(positionData) {
    let shape;
    shape = viewerObject.viewer.entities.add({
      name: 'Polygon',

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
    viewerObject.viewer.entities.remove(floatingPoint);
    viewerObject.viewer.entities.remove(activeShape);
    floatingPoint = undefined;
    activeShape = undefined;
    activeShapePoints = [];
  }

  modeGeometry.mode.setInputAction((event) => {
    const earthPosition = viewerObject.viewer.scene.pickPosition(event.position);

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

  modeGeometry.mode.setInputAction((event) => {
    if (Cesium.defined(floatingPoint)) {
      const newPosition = viewerObject.viewer.scene.pickPosition(event.endPosition);
      if (Cesium.defined(newPosition)) {
        floatingPoint.position.value = newPosition;
        activeShapePoints.pop();
        activeShapePoints.push(newPosition);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

  modeGeometry.mode.setInputAction((event) => {
    terminateShape();
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

export function getAllHandlers() {
}

// ------------------------------------------------------------------------------------------------------------ route mode

export function drawPolyLine() {
  // const osmBuildings = viewerObject.viewer.scene.primitives.add(Cesium.createOsmBuildings());
  const scene = viewerObject.viewer.scene;

  modeGeometry.mode = new Cesium.ScreenSpaceEventHandler(viewerObject.viewer.canvas);

  // let flightData = [];
  // let airplaneEntity = null;

  let pickedEntity;

  // let label = {
  //   font: '14px monospace',
  //   showBackground: false,
  //   horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM,
  //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //   pixelOffset: new Cesium.Cartesian2(0, -10),
  //   eyeOffset: new Cesium.Cartesian3(0, 0, 0),
  // };
  let counterPointsHeight = 0;

  function clearPointsHeight() {
    myPointsHeight.removeAll();
    counterPointsHeight = 0;
    pickedEntityObject.arrayPoints = [];
  }

  // async function drawRouteDrone() {
  //   const flightDataSecond = [];

  //   pickedEntityObject.arrayPoints.forEach((e) => {
  //     if (e.name == undefined) {
  //       viewerObject.viewer.entities.remove(e);
  //     } else if (e.name === 'Draggable_PointHeight') {
  //       const pos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
  //         e._position._value,
  //       );
  //       pos.latitude = (pos.latitude * 180) / Math.PI;
  //       pos.longitude = (pos.longitude * 180) / Math.PI;
  //       flightDataSecond.push(pos);
  //     }
  //   });

  //   const timeStepInSeconds = 30;
  //   const totalSeconds = timeStepInSeconds * (pickedEntityObject.arrayPoints.length - 1);
  //   const start = Cesium.JulianDate.now();
  //   const stop = Cesium.JulianDate.addSeconds(
  //     start,
  //     totalSeconds,
  //     new Cesium.JulianDate(),
  //   );
  //   viewerObject.viewer.clock.startTime = start.clone();
  //   viewerObject.viewer.clock.stopTime = stop.clone();
  //   viewerObject.viewer.clock.currentTime = start.clone();
  //   viewerObject.viewer.timeline.zoomTo(start, stop);
  //   viewerObject.viewer.clock.multiplier = 15;
  //   viewerObject.viewer.clock.shouldAnimate = true;

  //   const positionProperty = new Cesium.SampledPositionProperty();

  //   for (let i = 0; i < flightDataSecond.length; i++) {
  //     const dataPoint = flightDataSecond[i];

  //     const time = Cesium.JulianDate.addSeconds(
  //       start,
  //       i * timeStepInSeconds,
  //       new Cesium.JulianDate(),
  //     );
  //     const position = Cesium.Cartesian3.fromDegrees(
  //       dataPoint.longitude,
  //       dataPoint.latitude,
  //       dataPoint.height,
  //     );
  //     positionProperty.addSample(time, position);

  //     viewerObject.viewer.entities.add({
  //       description: `Location: (${position.longitude}, ${position.latitude}, ${position.height})`,
  //       position,
  //       point: { pixelSize: 1, color: Cesium.Color.YELLOW },
  //     });
  //   }

  //   airplaneEntity = viewerObject.viewer.entities.add({
  //     availability: new Cesium.TimeIntervalCollection([
  //       new Cesium.TimeInterval({ start, stop }),
  //     ]),
  //     position: positionProperty,
  //     point: { pixelSize: 30, color: Cesium.Color.GREEN },
  //     path: new Cesium.PathGraphics({ width: 1 }),
  //     label: {
  //       text: 'aircraft',
  //       font: '14px monospace',
  //       showBackground: false,
  //       horizontalOrigin: Cesium.HorizontalOrigin.BOTTOM,
  //       verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
  //       pixelOffset: new Cesium.Cartesian2(0, -15),
  //       eyeOffset: new Cesium.Cartesian3(0, 0, 0),
  //     },
  //   });
  // }

  // function createCesiumPoint(coordinates, size, color) {
  //   let point = new Cesium.PointGraphics({
  //     pixelSize: size,
  //     color,
  //     heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
  //   });
  //   label.text = 'point';

  //   let entity = new Cesium.Entity({
  //     position: coordinates,
  //     point,
  //     label,
  //   });

  //   return entity;
  // }

  // function disableCameraMotion(state, viewer) {
  //   viewerObject.viewer.scene.screenSpaceCameraController.enableRotate = state;
  //   viewerObject.viewer.scene.screenSpaceCameraController.enableZoom = state;
  //   viewerObject.viewer.scene.screenSpaceCameraController.enableLook = state;
  //   viewerObject.viewer.scene.screenSpaceCameraController.enableTilt = state;
  //   viewerObject.viewer.scene.screenSpaceCameraController.enableTranslate = state;
  // }

  // async function updateFlightData() {
  //   flightData = myPoints._entities._array
  //     .map((e) => {
  //       if (e._name != 'Dynamic line') {
  //         // return Cesium.Cartographic.fromCartesian(e.endPosition);
  //         const pos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(e.endPosition);
  //         pos.latitude = (pos.latitude * 180) / Math.PI;
  //         pos.longitude = (pos.longitude * 180) / Math.PI;
  //         pos.height = 600;
  //         return pos;
  //       }
  //       return false;
  //     });
  // }

  function getPointCoordinates(event, viewer) {
    let clickPosition = viewerObject.viewer.camera.pickEllipsoid(event.position);
    return clickPosition;
  }

  // ---------------

  modeGeometry.mode.setInputAction((click) => {
    waypointPosition = getPointCoordinates(click, viewer);
    routeEntity = createWaypoint(waypointPosition, viewer);
    // updateFlightData();
    getHeight(waypointPosition, routeEntity.id, false, false);
    // drawHeightPoint(waypointPosition)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  modeGeometry.mode.setInputAction((click) => {
    pickedEntityObject.arrayPoints = [];
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
}

// ------------------------------------------------------------- построение данных из дата

// const data = [
//   [
//     [56.58663215997809, 53.760603898204145],
//     [56.58109046208735, 53.786438935435605],
//     [56.57569007438673, 53.76875781360941],
//     [56.58663215997809, 53.760603898204145],
//   ],
// ];
// const data = [
//   [[56.58663215997809, 53.760603898204145]],
//   [
//     [56.58663215997809, 53.760603898204145],
//     [56.58114389026653, 53.786189856719005],
//     [56.58107740404901, 53.78639897716386],
//     [56.58105199331233, 53.78631577237097],
//     [56.58125145196489, 53.78568841103639],
//     [56.58135901366324, 53.78518696535378],
//     [56.58102658257564, 53.786232567578075],
//     [56.58100117183895, 53.78614936278519],
//     [56.581466575361596, 53.78468551967117],
//     [56.581574137059945, 53.78418407398856],
//     [56.580975761102266, 53.786066157992295],
//     [56.580950350365576, 53.7859829531994],
//     [56.5816816987583, 53.783682628305954],
//     [56.58178926045665, 53.78318118262334],
//     [56.580924939628886, 53.78589974840651],
//     [56.5808995288922, 53.78581654361362],
//     [56.58189682215501, 53.78267973694073],
//     [56.58200438385336, 53.78217829125812],
//     [56.58087411815551, 53.78573333882073],
//     [56.58084870741883, 53.78565013402783],
//     [56.582111945551716, 53.78167684557551],
//     [56.582219507250066, 53.781175399892895],
//     [56.58082329668214, 53.78556692923494],
//     [56.58079788594545, 53.78548372444205],
//     [56.58232706894842, 53.780673954210286],
//     [56.58243463064677, 53.78017250852768],
//     [56.58077247520877, 53.78540051964916],
//     [56.58074706447208, 53.785317314856265],
//     [56.58254219234513, 53.77967106284507],
//     [56.58264975404348, 53.77916961716246],
//     [56.581783035752466, 53.78189572373528],
//     [56.58663215997809, 53.760603898204145],
//   ],
//   [
//     [56.58663215997809, 53.760603898204145],
//     [56.58072165373539, 53.78523411006337],
//     [56.581783035752466, 53.78189572373528],
//     [56.58275731574184, 53.77866817147984],
//     [56.580696242998705, 53.785150905270484],
//     [56.580670832262015, 53.78506770047759],
//     [56.58286487744019, 53.778166725797234],
//     [56.58663215997809, 53.760603898204145],
//   ],
// ];
// {longitude: 85.98302925544387, latitude: 52.0247796607311, height: 600}
// {longitude: 85.98356974876896, latitude: 52.02253265039095, height: 600}
// {longitude: 85.98563333782289, latitude: 52.022370984535755, height: 600}
// {longitude: 85.98569766585815, latitude: 52.02507787212025, height: 600}

// const data = [
//   [
//     [85.98302925544387, 52.0247796607311],
//     [85.98356974876896, 52.02253265039095],
//     [85.98563333782289, 52.022370984535755],
//     [85.98569766585815, 52.02507787212025],
//   ],
//   [
//     [85.98402925544387, 52.0257796607311],
//     [85.98456974876896, 52.02353265039095],
//     [85.98663333782289, 52.02337098453575],
//     [85.98669766585815, 52.02607787212025],
//   ],
//   [
//     [85.9940292554438, 52.0357796607311],
//     [85.9945697487689, 52.03353265039095],
//     [85.99663333782289, 52.03337098453575],
//     [85.99669766585815, 52.03607787212025],
//   ],
//   [
//     [85.97402925544387, 52.0157796607311],
//     [85.97456974876896, 52.01353265039095],
//     [85.97663333782289, 52.01337098453575],
//     [85.97669766585815, 52.01607787212025],
//   ],
// ];

export function drawRouteFromData(data) {
  let currDelay = 0;
  data.map((e, indx) => {
    for (let j = 0; j < e.length; j++) {
      setTimeout(() => {
        // pickedEntityObject.arrayPoints = [];
        const pos = Cesium.Cartesian3.fromDegrees(e[j][0], e[j][1]);
        // routeEntity = createWaypoint(pos, viewer);
        if (j == e.length - 1) {
          getHeight(pos, `${pos.x}${pos.y}`, true, true);
        } else {
          getHeight(pos, `${pos.x}${pos.y}`, true, false);
        }
      }, currDelay * 300);
      currDelay += 1;
    }
    return e;
  });
}

export function getEntitiesHeight() {
  const arrayEntities = [...viewerObject.viewer.entities._entities._array].filter((e) => e._name === 'Draggable_PointHeight');
  const arrayRoutePZ = [];
  arrayEntities.forEach((e) => {
    const pos = Cesium.Ellipsoid.WGS84.cartesianToCartographic(
      e._position._value,
    );
    console.log('1 - e._position._value', e._position._value);
    console.log('1 - pos', pos);
    pos.latitude = (pos.latitude * 180) / Math.PI;
    pos.longitude = (pos.longitude * 180) / Math.PI;
    console.log('1 - pos.latitude - pos.longitude', pos.latitude, pos.longitude);
    pos.height -= nullHeightPZObject.nullHeightPZ;
    pos.height = Number(pos.height.toFixed(1));
    arrayRoutePZ.push([pos.longitude, pos.latitude, pos.height]);
    return pos;
  });
  return arrayRoutePZ;
}

export function createJSONobject(dataRoute) {
  const obj = {
    type: 'simple',
    route: {
      points: [],
      velocity: 12,
      cameraInterval: 0,
      finishedAction: 'GO_HOME',
    },
  };

  dataRoute.forEach((e) => {
    const currentObj = {
      lat: `${e[1]}`,
      lon: `${e[0]}`,
      alt: `${e[2]}`,
      speed: '10',
      actions: [],
    };
    obj.route.points.push(currentObj);
  });

  return obj;
}

export function sendServerPZ() {
  const arrayRoute = getEntitiesHeight();
  const objPZ = createJSONobject(arrayRoute);
  sendJSON(objPZ);
}

export function clearEntities() {
  viewerObject.viewer.entities.removeAll();
  myPoints.removeAll();
  clearPointsHeight();
}
