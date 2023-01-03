import React, { Component } from 'react';
import { addPictureSymbol, getFeatureDomainName, getLayerId, getMapInfo, makeIdentify, showLoading } from '../helper/common_func';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";
import Map from "@arcgis/core/Map";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer"
import * as intl from "@arcgis/core/intl";
import identifyIcon from '../../src/assets/images/identify.gif'
import SceneView from "@arcgis/core/views/SceneView";
import * as urlUtils from "@arcgis/core/core/urlUtils";
import { notificationMessage } from "../helper/utilsFunc";
import { withTranslation } from 'react-i18next';

class MapComponent extends Component {


    constructor(props) {
        super(props);

    }

    componentDidMount() {

        let mapServiceUrl = window.mapUrl;
        //1- get map info
        //2- query task
        //3- projection
        //4- get domain
        //5- highlight and zoom
        //6- add layers
        //7- map events
        //8- identify


        const graphicLayersIds = ["ZoomGraphicLayer", "SelectGraphicLayer",
            "printGraphicLayer", "identifyGraphicLayer", "ThematicGraphicLayer", "MarsedNoGraphicLayer", "locationGraphicLayer", "drawingGraphicLayer",
            "highlightGraphicLayer"];

        let map;

        let view;

        //esri proxy
        /*urlUtils.addProxyRule({
            proxyUrl: "https://maps.mrda.gov.sa/Proxy/proxy.ashx",
            urlPrefix: "webmap.mrda.gov.sa:6443"
        });*/

        if (this.props.type == "3d") {

            mapServiceUrl = window.dashboardMapUrl;

            const params = new URLSearchParams(window.location.search);

            map = new Map({
                basemap: params.get('maptype') == "dark" ? "streets-night-vector" :
                    "streets-navigation-vector"
            });

            intl.setLocale("ar");


            view = new SceneView({
                camera: window.initialCameraPosition,
                container: "mapDiv",
                map: map,
                popup: {
                    dockOptions: {
                        buttonEnabled: false
                    }
                },
                extent: window.fullExtent
            });
            // creates a new instance of the NavigationToggle widget


            map.view = view;
            window.__view = view;

            view.on('pointer-move', (evt) => {
                view.hitTest(evt).then((response) => {
                    if (response.results.length) {

                        var graphic = response.results.filter((result) => {
                            // check if the graphic belongs to the layer of interest 
                            return result.graphic.layer.id.indexOf("barLayer_") > -1;
                        });

                        if (graphic.length) {
                            graphic = graphic[0].graphic;
                            view.popup.open({
                                location: graphic.geometry.centroid,
                                features: [graphic]
                            });
                        }
                        else { view.popup.close(); }

                    } else {
                        view.popup.close();
                    }
                })
            });

        }
        else {
            map = new Map({
                basemap: "satellite"
            });
            view = new MapView({
                container: "mapDiv",
                map: map,
                constraints: {
                    minZoom: 2
                },
                ui: {
                    components: ["attribution"]
                },
                extent: window.fullExtent,
                /*padding: {
                    right: mapPadding // Same value as the #sidebar width in CSS
                  }*/
            });


            map.view = view;
        }


        var dynamicMapServiceLayer = new MapImageLayer({
            url: this.props.mapUrl || mapServiceUrl,
            id: 'baseMap'
        });

        map.layers.add(dynamicMapServiceLayer);

        graphicLayersIds.forEach((graphicLayerId) => {
            var graphicLayer = new GraphicsLayer({
                id: graphicLayerId,
                opacity: (graphicLayerId == "ThematicGraphicLayer") ? 0.8 : 1
            });
            map.layers.add(graphicLayer);
        });

        /*var homeBtn = new Home({
            view: view
        });
        view.ui.add(homeBtn, "top-left");*/
        //hide esri logo
        view.ui._removeComponents(["attribution"]);


        map.view = view;

        view.when(() => {
            let layersSetting = this.props.mainData.layers;
            getMapInfo(mapServiceUrl, layersSetting).then((response) => {

                map.__mapInfo = response;

                //showLoading(true);
                if (this.props.mapload)
                    this.props.mapload(map);

            }).catch(err=>{
                console.log(err);
                notificationMessage(this.props.t("retrievError"))
                showLoading(false);

            });
        }, function (error) {
            // Use the errback function to handle when the view doesn't load properly
            console.log("The view's resources failed to load: ", error);
        });


    }

    render() {
        return (
            <div id='mapDiv' style={{
                height: "100%",
                marginTop: this.props.openDrawer && this.props.mapExp && localStorage.user
                    ? "57px" : "",
                marginRight:
                    this.props.openDrawer &&
                        this.props.routeName !== "generalSearch" &&
                        this.props.routeName !== "outerSearch"
                        ? "300px"
                        : this.props.openDrawer &&
                            (this.props.routeName === "generalSearch" ||
                                this.props.routeName === "outerSearch")
                            ? "400px"
                            : "unset",
            }}>
            </div>
        )
    }
}

export default withTranslation('common')(MapComponent);
