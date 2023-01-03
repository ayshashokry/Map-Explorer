window.__config = {
  prod: {
    ApiUrl: "https://webgis.eamana.gov.sa/GISAPIV2/",
    hostURL: "https://webgis.eamana.gov.sa",
    filesURL: "https://webgis.eamana.gov.sa/GISAPI/",
    baseURI: "/gisnew",
    mapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE_NEW/MapServer",
    dashboardMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE/MapServer",

    printUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    trafficUrl:
      "https://webgis.eamana.gov.sa/tomtom/?z={z}&x={x}&y={y}&key=VGgyNzA5MjFUY0tzYVRURmxvd0Jhc2VkdGhUYzIwMjE=&thickness=2",
    mapPadding: 450,
    paginationCount: 20,
    is3dZoomEnabled: true,
    is3dHighlightOnly: false,
    initialCameraPosition: {
      position: {
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 4591700.624253098,
        y: 1685282.2062162554,
        z: 650262.1994772451,
      },
      heading: 0,
      tilt: 44.999999999999964,
    },
    fullExtent: {
      xmin: 5408759.285556535,
      ymin: 2991020.4036046173,
      xmax: 5692555.8371552015,
      ymax: 3141833.2052302207,
      spatialReference: {
        wkid: 102100,
      },
    },
    //GP urls
    exportFeaturesGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    cadToJsonGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/CADToJSON/GPServer/CADToJSON",
    shapeFileToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ShapeFileToJSON/GPServer/ShapeFileToJSON",
    kmlToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/KMLToJSON/GPServer/KMLToJSON",
    //API url
    webApiUrl: "https://webgis.eamana.gov.sa/GISAPIV2/",
    workflowUrl: "https://webgis.eamana.gov.sa/gisv2/#/",
  },
  prod_deploy: {
    ApiUrl: window.origin + "/GISAPIV2",
    hostURL: window.origin,
    filesURL: window.origin + "/GISAPI/",
    baseURI: "/gisnew",
    mapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE_NEW/MapServer",
    dashboardMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE/MapServer",

    printUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    trafficUrl:
      "https://webgis.eamana.gov.sa/tomtom/?z={z}&x={x}&y={y}&key=VGgyNzA5MjFUY0tzYVRURmxvd0Jhc2VkdGhUYzIwMjE=&thickness=2",
    mapPadding: 450,
    paginationCount: 20,
    is3dZoomEnabled: true,
    is3dHighlightOnly: false,
    initialCameraPosition: {
      position: {
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 4591700.624253098,
        y: 1685282.2062162554,
        z: 650262.1994772451,
      },
      heading: 0,
      tilt: 44.999999999999964,
    },
    fullExtent: {
      xmin: 5408759.285556535,
      ymin: 2991020.4036046173,
      xmax: 5692555.8371552015,
      ymax: 3141833.2052302207,
      spatialReference: {
        wkid: 102100,
      },
    },
    //GP urls
    exportFeaturesGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    cadToJsonGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/CADToJSON/GPServer/CADToJSON",
    shapeFileToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ShapeFileToJSON/GPServer/ShapeFileToJSON",
    kmlToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/KMLToJSON/GPServer/KMLToJSON",
    //API url
    webApiUrl: "https://webgis.eamana.gov.sa/GISAPIV2/",
    workflowUrl: "https://webgis.eamana.gov.sa/gisv2/#/",
  },
  stage: {
    ApiUrl: "http://77.30.168.84/GISAPITESTV2",
    hostURL: "http://77.30.168.86",
    filesURL: "http://77.30.168.84/GISAPI/",
    baseURI: "/gisnew",
    mapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE_NEW/MapServer",
    dashboardMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE/MapServer",

    printUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    trafficUrl:
      "https://webgis.eamana.gov.sa/tomtom/?z={z}&x={x}&y={y}&key=VGgyNzA5MjFUY0tzYVRURmxvd0Jhc2VkdGhUYzIwMjE=&thickness=2",
    mapPadding: 450,
    paginationCount: 20,
    is3dZoomEnabled: true,
    is3dHighlightOnly: false,
    initialCameraPosition: {
      position: {
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 4591700.624253098,
        y: 1685282.2062162554,
        z: 650262.1994772451,
      },
      heading: 0,
      tilt: 44.999999999999964,
    },
    fullExtent: {
      xmin: 5408759.285556535,
      ymin: 2991020.4036046173,
      xmax: 5692555.8371552015,
      ymax: 3141833.2052302207,
      spatialReference: {
        wkid: 102100,
      },
    },
    //GP urls
    exportFeaturesGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    cadToJsonGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/CADToJSON/GPServer/CADToJSON",
    shapeFileToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ShapeFileToJSON/GPServer/ShapeFileToJSON",
    kmlToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/KMLToJSON/GPServer/KMLToJSON",
    //API url
    webApiUrl: "https://webgis.eamana.gov.sa/GISAPIV2/",
    workflowUrl: "https://webgis.eamana.gov.sa/gisv2/#/",
  },
  master: {
    ApiUrl: "http://77.30.168.84/GISAPIDEVV2/",
    hostURL: "http://77.30.168.86",
    filesURL: "http://77.30.168.84/GISAPI/",
    baseURI: "/gisnew",
    mapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE_NEW/MapServer",
    dashboardMapUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/MAPVIEWERSERVICE/MapServer",

    printUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
    trafficUrl:
      "https://webgis.eamana.gov.sa/tomtom/?z={z}&x={x}&y={y}&key=VGgyNzA5MjFUY0tzYVRURmxvd0Jhc2VkdGhUYzIwMjE=&thickness=2",
    mapPadding: 450,
    paginationCount: 20,
    is3dZoomEnabled: true,
    is3dHighlightOnly: false,
    initialCameraPosition: {
      position: {
        spatialReference: { latestWkid: 3857, wkid: 102100 },
        x: 4591700.624253098,
        y: 1685282.2062162554,
        z: 650262.1994772451,
      },
      heading: 0,
      tilt: 44.999999999999964,
    },
    fullExtent: {
      xmin: 5408759.285556535,
      ymin: 2991020.4036046173,
      xmax: 5692555.8371552015,
      ymax: 3141833.2052302207,
      spatialReference: {
        wkid: 102100,
      },
    },
    //GP urls
    exportFeaturesGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ExportFeatures/GPServer/ExportFeatures",
    cadToJsonGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/CADToJSON/GPServer/CADToJSON",
    shapeFileToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/ShapeFileToJSON/GPServer/ShapeFileToJSON",
    kmlToJSONGPUrl:
      "https://webgis.eamana.gov.sa/arcgisnew/rest/services/KMLToJSON/GPServer/KMLToJSON",
    //API url
    webApiUrl: "https://webgis.eamana.gov.sa/GISAPIV2/",
    workflowUrl: "https://webgis.eamana.gov.sa/gisv2/#/",
  },
};
