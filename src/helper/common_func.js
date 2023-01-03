import Query from "@arcgis/core/tasks/support/Query";
import QueryTask from "@arcgis/core/tasks/QueryTask";
import esriRequest from "@arcgis/core/request";
import StatisticDefinition from "@arcgis/core/rest/support/StatisticDefinition";
import Graphic from "@arcgis/core/Graphic";
import moment from "moment-hijri";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import * as projection from "@arcgis/core/geometry/projection";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import IdentifyParameters from "@arcgis/core/rest/support/IdentifyParameters";
import * as identify from "@arcgis/core/rest/identify";
import * as geoprocessor from "@arcgis/core/rest/geoprocessor";
import Extent from "@arcgis/core/geometry/Extent";
import BaseTileLayer from "@arcgis/core/layers/BaseTileLayer";
import Color from "@arcgis/core/Color";
import locationIcon from "../assets/images/location.gif";
// import { layersSetting } from './layers'

import { message } from "antd";

export const CustomTileLayer = BaseTileLayer.createSubclass({
  properties: {
    urlTemplate: null,
    id: null,
    tint: {
      value: null,
      type: Color,
    },
  },

  // generate the tile url for a given level, row and column
  getTileUrl: function (level, row, col) {
    return this.urlTemplate
      .replace("{z}", level)
      .replace("{x}", col)
      .replace("{y}", row);
  },

  // This method fetches tiles for the specified level and size.
  // Override this method to process the data returned from the server.
  fetchTile: function (level, row, col, options) {
    // call getTileUrl() method to construct the URL to tiles
    // for a given level, row and col provided by the LayerView
    const url = this.getTileUrl(level, row, col);

    // request for tiles based on the generated url
    // the signal option ensures that obsolete requests are aborted
    return esriRequest(url, {
      responseType: "image",
      signal: options && options.signal,
    }).then(
      function (response) {
        // when esri request resolves successfully
        // get the image from the response
        const image = response.data;
        const width = this.tileInfo.size[0];
        const height = this.tileInfo.size[0];

        // create a canvas with 2D rendering context
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;

        // Apply the tint color provided by
        // by the application to the canvas
        if (this.tint) {
          // Get a CSS color string in rgba form
          // representing the tint Color instance.
          context.fillStyle = this.tint.toCss();
          context.fillRect(0, 0, width, height);

          // Applies "difference" blending operation between canvas
          // and steman tiles. Difference blending operation subtracts
          // the bottom layer (canvas) from the top layer (tiles) or the
          // other way round to always get a positive value.
          context.globalCompositeOperation = "difference";
        }

        // Draw the blended image onto the canvas.
        context.drawImage(image, 0, 0, width, height);

        return canvas;
      }.bind(this)
    );
  },
});

export const project = (features, outSR, callback) => {
  if (features && features.length > 0) {
    var isSameWkid = false;
    if (
      (features[0].geometry &&
        features[0].geometry.spatialReference.wkid == outSR) ||
      (features[0].spatialReference &&
        features[0].spatialReference.wkid == outSR)
    ) {
      isSameWkid = true;
      callback(features);
    }
    if (!isSameWkid) {
      projection.load().then(() => {
        let outSpatialReference = new SpatialReference({
          wkid: outSR,
        });
        let returnFeatures = [];
        features.forEach((graphic) => {
          if (graphic.geometry)
            graphic.geometry = projection.project(
              graphic.geometry,
              outSpatialReference
            );
          else {
            graphic = projection.project(graphic, outSpatialReference);
          }
          returnFeatures.push(graphic);
        });
        callback(returnFeatures);
      });
    }
  } else {
    callback(features);
  }
};

export const queryTask = function (settings) {
  if (!settings.notShowLoading && !settings.returnExecuteObject)
    showLoading(true);

  var query = new Query();
  query.returnGeometry = settings.returnGeometry || false;
  if (settings.geometry) query.geometry = settings.geometry;

  query.returnIdsOnly = settings.returnIdsOnly || false;
  //query.returnCountOnly = settings.returnCountOnly || false
  query.outFields = settings.outFields || ["*"];
  query.returnDistinctValues = settings.returnDistinctValues || false;

  if (query.returnDistinctValues) {
    query.returnGeometry = false;
  }

  if (settings.num && !settings.statistics) {
    query.start = settings.start;
    query.num = settings.num;
  }

  if (settings.statistics) {
    query.outStatistics = [];
    var statisticDefinition = {};
    settings.statistics.forEach((val) => {
      statisticDefinition = new StatisticDefinition();
      statisticDefinition.statisticType = val.type;
      statisticDefinition.onStatisticField = val.field;
      statisticDefinition.outStatisticFieldName = val.name;
      query.outStatistics.push(statisticDefinition);
    });
  }

  query.groupByFieldsForStatistics = settings.groupByFields;
  // query.returnCountOnly = settings.returnCountOnly || false
  if (settings.preQuery) {
    settings.preQuery(query, Query);
  }
  //for pagination --> use num, start
  if (settings.start && settings.num) {
    query.num = settings.num;
    query.start = settings.start;
  }
  if (settings.orderByFields) {
    query.orderByFields = settings.orderByFields;
  }

  if (settings.queryWithGemoerty) {
    query.geometry = settings.geometry;
    if (settings.where) {
      query.where = settings.where;
    }
    if (settings.distance) {
      query.distance = settings.distance || 5;
    }
    query.units = "meters"; //"kilometers";
  } else {
    query.where = settings.where || "1=1";
  }

  /*if (query.where) {
        query.where = "(" + query.where + ")";
    }*/
  var token = "";
  if (window.esriToken) token = "?token=" + window.esriToken;
  // var hasPermission = $rootScope.getPermissions('splitandmerge.MAPEXPLORER', 'modules.INVESTMENTLAYERS')
  // if (hasPermission) {
  // token = '?token=' + $rootScope.User.esriToken
  // }
  if (settings.url.indexOf("?token=") > -1) {
    token = "";
  }

  var queryTask = new QueryTask(settings.url + token); // + "?token=" + $rootScope.User.esriToken + "&username='d'")

  function callback(data) {
    // store.dispatch({type:'Show_Loading_new',loading: false})
    if (!settings.notShowLoading && !settings.returnExecuteObject)
      showLoading(false);
    settings.callbackResult(data);
  }

  function callbError(data) {
    message.error("حدث خطأ اثناء استرجاع البيانات");
    //window.notifySystem('warning', 'حدث خطأ اثناء استرجاع البيانات')
    // store.dispatch({type:'Show_Loading_new',loading: false})
    showLoading(false);
    if (settings.callbackError) {
      settings.callbackError(data);
    }
  }

  if (settings.returnCountOnly) {
    queryTask.executeForCount(query).then(callback, callbError);
  } else if (settings.returnExecuteObject) {
    !settings.notShowLoading&&showLoading(false);
    return queryTask.execute(query);
  } else {
    queryTask.execute(query).then(callback, callbError);
  }
};

export const drawLine = function (settings) {
  var feature = settings.feature;
  var map = settings.map;
  var $event = settings.event;

  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");

  context.canvas.width = window.innerWidth;
  context.canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);

  var point;

  if (feature.geometry) {
    if (feature.geometry.type == "point") {
      point = map.view.toScreen(feature.geometry);
    } else if (feature.geometry.type == "polygon") {
      point = map.view.toScreen(feature.geometry.centroid);
    } else {
      point = map.view.toScreen(feature.geometry.extent.center);
    }

    if (
      !(
        point.x < 0 ||
        point.y < 0 ||
        point.x > window.innerWidth - (settings.hideFromWidth || 450) ||
        point.y > window.innerHeight - (settings.hideFromHeight || 0)
      )
    ) {
      context.moveTo(point.x, point.y);

      context.lineTo($event.clientX, $event.clientY);
      context.lineWidth = 1.5;

      var color = "#212121";

      context.strokeStyle = color;
      context.stroke();

      context.beginPath();
      context.strokeStyle = color;
      context.arc(point.x, point.y, 3, 0, 2 * Math.PI, true);
      context.fill();
    }
  }
};

export const navigateToGoogle = (lat, long) => {
  window.open(`https://maps.google.com/maps?q=${lat},${long}`, "_blank");
};

export const zoomToFeatureDefault = (feature, map, is3d) => {
  highlightFeature(feature, map, {
    layerName: "ZoomGraphicLayer",
    isZoom: true,
    zoomDuration: 1000,
    isDashStyle: true,
  });
};
export const zoomToFeatures = (features,map)=>{
  let fullExtent = null;
  for (let i = 0; i < features.length; i++) {
    if (features[i].geometry && features[i].geometry.extent) {
      if (!fullExtent) fullExtent = features[i].geometry.extent.clone();
      else fullExtent.union(features[i].geometry.extent);
    }
  }
  let cloneExt = fullExtent.clone();

  map.view.goTo(
    {
      target: features,
      extent:  cloneExt,
    },
    {
      duration:  1000, // Duration of animation will be 1 seconds
    }
  );
}
export const groupBy = function (xs, key) {
  return xs.reduce((rv, x) => {
    (rv[x.attributes[key]] = rv[x.attributes[key]] || []).push(x);
    return rv;
  }, {});
};

export const DrawCirclePoints = (points, radius, center, pointIndex) => {
  let slice = (2 * Math.PI) / points;
  //for (let i = 0; i < points; i++)
  //{
  let angle = slice * pointIndex;
  let newX = center.x + radius * Math.cos(angle);
  let newY = center.y + radius * Math.sin(angle);
  return { x: newX, y: newY };
  //}
};

export const isInitialExtent = (view) => {
  return (
    view.camera.position.x == window.initialCameraPosition.position.x &&
    view.camera.position.y == window.initialCameraPosition.position.y &&
    view.camera.position.z == window.initialCameraPosition.position.z
  );
};

export const drawText = (
  point,
  text,
  map,
  layerName,
  fontSize,
  offsetX,
  offsetY
) => {
  let textSymbol = {
    type: "text", // autocasts as new TextSymbol()
    color: "white",
    haloColor: "black",
    haloSize: "1px",
    text: text,
    xoffset: offsetX || 3,
    yoffset: offsetY || 3,
    font: {
      // autocasts as new Font()
      size: fontSize || 20,
      weight: "bold",
    },
  };

  let graphicLayer = map.findLayerById(layerName);

  var graphic = new Graphic({
    geometry: point.geometry || point,
    symbol: textSymbol,
  });

  graphicLayer.add(graphic);
};

export const zoomToFeatureByObjectId = (
  attributes,
  map,
  returnGeometryAndNotZoom,
  callback
) => {
  if (attributes) {
    if (attributes.geometry) {
      if (!returnGeometryAndNotZoom) {
        highlightFeature(attributes, map, {
          layerName: "ZoomGraphicLayer",
          isZoom: true,
          zoomDuration: 1000,
          isDashStyle: true,
        });
      }
      if (callback) callback(attributes);
    } else {
      let layerdId = getLayerId(map.__mapInfo, attributes.layerName);

      queryTask({
        url: window.mapUrl + "/" + layerdId,
        where: "OBJECTID = " + attributes.id || attributes.OBJECTID,
        outFields: ["OBJECTID"],
        returnGeometry: true,
        callbackResult: ({ features }) => {
          if (!returnGeometryAndNotZoom) {
            highlightFeature(features[0], map, {
              layerName: "ZoomGraphicLayer",
              isZoom: true,
              zoomDuration: 1000,
              isDashStyle: true,
            });
          }
          if (callback) callback(features[0]);
        },
        callbackError(error) {},
      });
    }
  }
};

export const zoomToFeatureByFilter = (
  where,
  layerName,
  map,
  returnGeometryAndNotZoom,
  callback
) => {
  let layerdId = getLayerId(map.__mapInfo, layerName);

  queryTask({
    url: window.mapUrl + "/" + layerdId,
    where: where,
    outFields: ["OBJECTID"],
    returnGeometry: true,
    callbackResult: ({ features }) => {
      if (features.length > 0) {
        if (!returnGeometryAndNotZoom) {
          highlightFeature(features[0], map, {
            layerName: "ZoomGraphicLayer",
            isZoom: true,
            isHighlighPolygonBorder: true,
            zoomDuration: 1000,
            notExpandLevel: true,
          });
        }
        if (callback) callback(features[0]);
      }
    },
    callbackError(error) {},
  });
};

export const getFromEsriRequest = function (url) {
  //store.dispatch({ type: 'Show_Loading_new', loading: true })

  var requestHandler = esriRequest(url, {
    responseType: "json",
  });

  return requestHandler.then(
    ({ data }) => {
      //store.dispatch({ type: 'Show_Loading_new', loading: false })
      return data;
    },
    (error) => {
      //store.dispatch({ type: 'Show_Loading_new', loading: false })
      throw "error";
    }
  );
};
// let mapInfo

export const getMapInfo =  function (url, layersSetting) {
  return new Promise(async(resolve, reject) => {
    let out = { layersSetting };
    var token = "";
    if (window.esriToken) token = "&token=" + window.esriToken;
    try{

    
   let mapInfo = await getFromEsriRequest(url + "?f=pjson" + token);
      out.info = {};
      out.info.mapInfo = mapInfo;
     let legendInfo = await getFromEsriRequest(url + "/legend" + "?f=pjson" + token);
          out.info.$legends = legendInfo.layers;
       let layerInfo = await getFromEsriRequest(url + "/layers" + "?f=pjson" + token);
              out.info.$layers = layerInfo;

              out.info.$layers.layers = out.info.$layers.layers.map(
                (layer, key) => {
                  if (
                    out.layersSetting[layer.name] &&
                    out.layersSetting[layer.name].order
                  )
                    layer.viewerOrder = out.layersSetting[layer.name].order;
                  layer.alias = out.info.$layers.layers[key].name;
                  return layer;
                }
              );

              let visibiles = [];
              out.info.$legends = out.info.$legends.map((layer, key) => {
                layer.visible = out.info.$layers.layers[key].defaultVisibility;
                if (
                  out.layersSetting[layer.name] &&
                  out.layersSetting[layer.layerName]?.order
                )
                  layer.viewerOrder = out.layersSetting[layer.layerName].order;
                // //

                if (layer.visible) {
                  visibiles.push(layer.layerId);
                }

                layer.isHidden =
                  out.layersSetting[layer.layerName] &&
                  out.layersSetting[layer.layerName]?.isHidden;
                layer.alias = out.info.$layers.layers[key].name;
                return layer;
              });

              out.mapVisibleLayerIDs = visibiles;
              mapInfo = out;
              resolve(out);
         
       
   
  }catch(err){
    reject(err)
  }
  });
};

export const addPictureSymbol = function (
  point,
  icon,
  layerName,
  map,
  width,
  height
) {
  var symbol = new PictureMarkerSymbol({
    url: icon,
    height: height || 48,
    width: width || 48,
    yoffset: (height || 48) / 2 - 2,
  });
  var graphic = new Graphic({
    geometry: point,
    symbol: symbol,
  });

  map.findLayerById(layerName || "identifyGraphicLayer").removeAll();
  map.findLayerById(layerName || "identifyGraphicLayer").add(graphic);
};

export const clearCanvasLine = function () {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, window.innerWidth, window.innerHeight);
};

export const highlightFeature = function (features, map, settings) {
  var symbol;
  let fillColor = settings.fillColor || [0, 0, 0, 0.3];
  let strokeColor = settings.strokeColor || "black";
  let highlighColor = settings.highlighColor || [0, 255, 255, 0.5];

  let graphicLayer = map.findLayerById(settings.layerName);

  if (!settings.noclear) graphicLayer.removeAll();

  features = features.length ? features : [features];

  features.forEach((feature) => {
    if (settings.isHiglightSymbol) {
      strokeColor = highlighColor;
      fillColor = settings.fillColor || highlighColor;
    }

    if (feature.type === "point" || feature.geometry.type === "point") {
      if (settings.isAnimatedLocation) {
        symbol = new PictureMarkerSymbol({
          url: locationIcon,
          height: 48,
          width: 48,
          yoffset: 48 / 2 - 2,
        });
      } else {
        symbol = new SimpleMarkerSymbol({
          style: "circle",
          color: settings.isHiglightSymbol ? highlighColor : fillColor,
          size: "20px", // pixels
          outline: {
            color: "black",
            width: 1, // points
          },
        });
      }
    } else if (
      feature.type === "polyline" ||
      feature.geometry.type === "polyline" ||
      feature.geometry.paths
    ) {
      symbol = new SimpleLineSymbol({
        color: highlighColor,
        width: "10px",
        style: "solid",
      });
    } else {
      symbol = GetSymbol(
        settings,
        settings.fillColor || fillColor,
        strokeColor
      );
    }

    if (!settings.isZoomOnly) {
      var graphic = new Graphic({
        geometry: feature.geometry || feature,
        symbol: symbol,
        attributes: settings.attr,
      });

      graphicLayer.add(graphic);
    }
  });

  if (!settings.listOfFeatures && settings.isZoom) {
    var fullExtent = null;
    for (var i = 0; i < features.length; i++) {
      if (features[i].geometry && features[i].geometry.extent) {
        if (!fullExtent) fullExtent = features[i].geometry.extent.clone();
        else fullExtent.union(features[i].geometry.extent);
      }
    }

    //for polygon , polyline
    if (fullExtent) {
      if (map.view.type == "3d") {
        if (settings.isZoomToCenter && features.length == 1) {
          map.view.goTo(
            {
              target: features[0].geometry.centroid,
              zoom: settings.zoomLevel || 9,
            },
            { duration: 1000 }
          );
        } else {
          map.view
            .goTo({
              target: features,
              heading: 0,
              tilt: window.is3dZoomEnabled ? 45 : 0,
            })
            .then(() => {
              if (settings.isZoomMoreLevels) {
                map.view.goTo({
                  zoom: map.view.zoom + 1.5,
                });
              }
            });
        }
      } else {
        var cloneExt = fullExtent.clone();

        map.view.goTo(
          {
            target: features,
            extent: settings.notExpandLevel ? cloneExt : cloneExt.expand(2),
          },
          {
            duration: settings.zoomDuration || 1000, // Duration of animation will be 1 seconds
          }
        );
      }
    } else {
      // array of points
      if (features.length > 1) {
        const [convexHull] = geometryEngine.convexHull(
          features.map((f) => {
            return f.geometry;
          }),
          true
        );

        map.view.goTo(
          { target: convexHull },
          { duration: settings.zoomDuration || 1000 }
        );
      } else {
        map.view.goTo(
          { target: features, zoom: 18 },
          { duration: settings.zoomDuration || 1000 }
        );
      }
    }
  }
};

const GetSymbol = function (settings, fillColor, strokeColor) {
  let symbol;
  let highlightWidth = settings.highlightWidth || 2;
  let highlighColor = settings.highlighColor || [0, 255, 255, 1];

  let symbolOption = {
    style: "solid",
    color: fillColor,
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: strokeColor,
      width: highlightWidth + "px",
    },
  };

  if (settings.isHiglightSymbol) {
    symbolOption = {
      style: "solid",
      color: highlighColor,
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: highlighColor,
        width: highlightWidth + "px",
      },
    };
    symbol = new SimpleFillSymbol(symbolOption);
  } else if (settings.isDashStyle) {
    symbolOption = {
      style: "forward-diagonal",
      color: strokeColor,
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: strokeColor,
        width: highlightWidth + "px",
      },
    };
    symbol = new SimpleFillSymbol(symbolOption);
  } else if (settings.isHighlighPolygonBorder) {
    symbolOption = {
      style: "none",
      color: highlighColor,
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: strokeColor,
        width: highlightWidth + "px",
      },
    };
    symbol = new SimpleFillSymbol(symbolOption);
  } else {
    symbolOption = {
      style: "solid",
      color: highlighColor,
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: strokeColor,
        width: highlightWidth + "px",
      },
    };
    symbol = new SimpleFillSymbol(symbolOption);
  }

  return symbol;
};

// maping field with domain
export const getFeatureDomainName = function (
  features,
  layerId,
  notReturnCode,
  domainMapUrl,
  isIdentifyResults
) {
  return getDomain(layerId, {}, domainMapUrl).then(
    function (data) {
      var codedValue = {};
      features.forEach(function (feature) {
        Object.keys(feature.attributes).forEach(function (attr) {
          let result = data.find((d) => d.name == attr);
          if (result && result.domain) {
            codedValue = result.domain.codedValues.find(
              (d) => {
                //these next 3 lines to add coded values into attributes in case of identify  
               if(isIdentifyResults && feature.attributes[attr] && !parseInt(feature.attributes[attr])){
                 if(d.name===feature.attributes[attr])feature.attributes[attr] = d.code ;
               } 
               return d.code == feature.attributes[attr]
              }
            );
            if (!codedValue) {
              if (!isNaN(feature.attributes[attr])) {
                codedValue = result.domain.codedValues.find(
                  (d) => d.code == +feature.attributes[attr]
                );
              }
            }
            if (codedValue && codedValue.name) {
              if (!notReturnCode)
                feature.attributes[attr + "_Code"] = feature.attributes[attr];
              feature.attributes[attr] = codedValue.name;
            }
          }
        });
      });
      return features;
    },
    function (error) {
      return;
    }
  );
};

let mapViewerTempObj = {};

const getDomain = function (layerId, settings, domainMapUrl) {
  return new Promise((resolve, reject) => {
    let serv = mapViewerTempObj;
    let loadings = [];
    var returnedDomain;

    if (serv.Domains && serv.Domains[layerId]) {
      const domain = serv.Domains[layerId];
      if (!settings.fieldName && !settings.code) {
        domain.fields.forEach(function (val) {
          if (!val.domain) {
            settings.fieldName = val.name;
            settings.isSubType = true;
            if (domain.types) {
              returnedDomain = getSubTypes(domain, settings);

              if (returnedDomain) {
                if (settings.isfilterOpened) val.domain = returnedDomain;
                else val.domain = { codedValues: returnedDomain };
              } else val.domain = null;
            }
          }
        });
        returnedDomain = domain.fields;
      } else if (settings.isSubType && settings.fieldName) {
        returnedDomain = getSubTypes(domain, settings);
      } else {
        domain.fields.forEach(function (field) {
          if (field.name == settings.fieldName && field.domain) {
            returnedDomain = field.domain.codedValues;
          }
        });
      }
    }

    if (returnedDomain) {
      resolve(returnedDomain);
      return;
    } else {
      var url = (domainMapUrl || window.mapUrl) + "/" + layerId;
      let token = "";
      if (window.esriToken) {
        token = "&token=" + window.esriToken;
      }
      if (loadings.indexOf(url) == -1) {
        loadings.push(url);
        getFromEsriRequest(url + "?f=pjson" + token).then(
          (res) => {
            serv.Domains = serv.Domains || [];
            mapViewerTempObj.Domains[layerId] = {
              fields: res.fields,
              types: res.types,
            };
            loadings.pop(url);
            getDomain(layerId, settings, domainMapUrl).then(
              (data) => {
                resolve(data);
                return;
              },
              function () {}
            );
          },
          function () {
            loadings.pop(url);
          }
        );
      } else {
        return reject();
      }
    }
  });
};

const getSubTypes = function (domain, settings) {
  var returnedDomain = [];
  if (domain.types) {
    domain.types.forEach(function (subType) {
      if (settings.isSubType && !settings.code) {
        if (!returnedDomain) returnedDomain = [];

        if (subType.domains[settings.fieldName]) {
          if (settings.isfilterOpened)
            returnedDomain.push({
              id: subType.id,
              name: subType.name,
              isSubType: true,
            });
          else
            returnedDomain.push.apply(
              returnedDomain,
              subType.domains[settings.fieldName].codedValues
            );
        }
      } else {
        if (
          subType.id == settings.code &&
          subType.domains[settings.fieldName]
        ) {
          returnedDomain = subType.domains[settings.fieldName].codedValues;
        }
      }
    });
  }

  return returnedDomain.length == 0 ? null : returnedDomain;
};

export const makeIdentify = function (
  mapView,
  mapPoint,
  layerIds,
  tolerance,
  layerOption
) {
  // Set the parameters for the identify
  let params = new IdentifyParameters();
  params.tolerance = tolerance || 3;
  params.layerIds = layerIds || [];
  params.sublayers = layerIds ? [{ id: layerIds[0] }] : []; //added line for fix esri layerIds bug
  params.layerOption = layerOption || "visible"; //"top"|"visible"|"all"
  params.width = mapView.width;
  params.height = mapView.height;
  params.geometry = mapPoint;
  params.mapExtent = mapView.extent;
  params.returnFieldName = true;
  params.returnGeometry = true;

  return identify.identify(window.mapUrl, params);
};

export const getLayerId = function (mapInfo, layerName) {
  let findLayer = mapInfo.info.$layers.layers.find((x) => x.name == layerName);
  if (!findLayer) {
    findLayer = mapInfo.info.$layers.tables.find((x) => x.name == layerName);
  }
  return findLayer && findLayer.id;
};

export const isLayerExist = function (mapInfo, layerName) {
  let findLayer = mapInfo.info.$layers.layers.find((x) => x.name == layerName);
  if (!findLayer) {
    findLayer = mapInfo.info.$layers.tables.find((x) => x.name == layerName);
  }
  return findLayer;
};

export const convertHirjiDateToTimeSpan = function (time, isEndDate) {
  //CREATED_DATE >= TIMESTAMP '2021-08-09 00:00:00' and CREATED_DATE <= TIMESTAMP '2021-11-05 23:59:59'
  let timeStamp = moment(time + " 00:00", "iYYYY/iM/iD HH:mm").format(
    "YYYY-M-D HH:mm:ss"
  );

  if (isEndDate) {
    timeStamp = moment(time + " 23:59:59", "iYYYY/iM/iD HH:mm:ss").format(
      "YYYY-M-D HH:mm:ss"
    );
  }
  return " TIMESTAMP '" + timeStamp + "'";
};
export const convertDateToTimeStamp = (time, isEndDate) => {
  //CREATED_DATE >= TIMESTAMP '2021-08-09 00:00:00' and CREATED_DATE <= TIMESTAMP '2021-11-05 23:59:59'
  let timeStamp =
    time.getUTCFullYear() +
    "-" +
    (time.getUTCMonth() + 1) +
    "-" +
    time.getUTCDate();
  if (!isEndDate) {
    timeStamp = timeStamp + " 00:00:00";
  } else timeStamp = timeStamp + " 23:59:59";
  return " TIMESTAMP '" + timeStamp + "'";
};
export const showLoading = function (showLoading) {
  window.__showLoadingItems = window.__showLoadingItems || [];

  if (showLoading) window.__showLoadingItems.push(showLoading);
  else window.__showLoadingItems.pop();

  const customEvent = new CustomEvent("showLoading", { detail: showLoading });
  document.dispatchEvent(customEvent);
};

export const showGeneralDataTable = function (param) {
  const customEvent = new CustomEvent("showGeneralDataTable", {
    detail: param,
  });
  document.dispatchEvent(customEvent);
};

export const clearGraphicLayer = (layerName, map) => {
  let graphicLayer = map.findLayerById(layerName);

  if (graphicLayer && graphicLayer.removeAll) graphicLayer.removeAll();
};

export const IsNotNull = (value) => {
  value = value + "";
  return (
    value && value.toLowerCase() != "null" && value != "" && value != "nan"
  );
};

export const clearGraphics = (graphicLayerName, map) => {
  if (typeof graphicLayerName === "string") {
    let layerOnMap = map.findLayerById(graphicLayerName);
    if (layerOnMap) layerOnMap.removeAll();
  } else if (graphicLayerName) {
    graphicLayerName.forEach((gr) => {
      let layerOnMap = map.findLayerById(gr);
      if (layerOnMap) layerOnMap.removeAll();
    });
  }
};
export const executeGPTool = async (
  gpUrl,
  params,
  callback,
  callbackError,
  outputName = "output_value"
) => {
  try {
    let jobInfo = await geoprocessor.submitJob(gpUrl, params);
    let result = await jobInfo.waitForJobCompletion();
    result = await result.fetchResultData(outputName);
    if (result.value) callback(result.value);
    else callback("");
  } catch (err) {
    callbackError(err);
  }
};
