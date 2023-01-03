import React, { Component } from "react";
import { LayerComponent } from "./layer_component";
import { Slider } from "antd";

import * as watchUtils from "@arcgis/core/core/watchUtils";
// import { layersSetting } from "../../../helper/layers";
import { withTranslation } from "react-i18next";
import i18n from "../../../i18n";

class TocComponent extends Component {
  state = {};

  constructor(props) {
    super(props);

    this.state = {
      layers: props.map.__mapInfo.info,
    };
  }
  startOperation() {
    this.setState({
      showPopUp: !this.state.showPopUp,
    });
  }
  expand(layer, key) {
    let { layers } = this.state;
    layers.$legends[key].show = !layers.$legends[key].show;
    this.setState({ layers });
  }
  changeLayer(layer, key) {
    let { layers } = this.state;
    layers.$legends[key].visible = !layers.$legends[key].visible;
    this.setState({ layers });

    let visibiles = this.state.layers.$legends
      .filter((layer) => layer.visible)
      .map((d) => d.layerId);

    //this.props.map.mapVisibleLayerIDs = visibiles;

    this.props.map
      .findLayerById("baseMap")
      .allSublayers._items.forEach((layer) => {
        if (!layer.sublayers) {
          let l = visibiles.find((x) => x == layer.id);
          layer.visible = l != null ? true : false;
        }
      });
  }

  zoomToLayer(layer, key) {
    if (layer && layer.minScale > 0 && layer.disable) {
      var dpi = 96; // Set to resolution of your screen
      var scale = layer.minScale;
      //this.props.map.view.scale = scale;
      var mapunitInMeters = 111319.5; // size of one degree at Equator. Change if you are using a projection with a different unit than degrees
      var newRes = scale / (dpi * 39.37 * mapunitInMeters);
      var newExtent = this.props.map.view.extent.expand(newRes * 200);
      this.props.map.view.goTo(newExtent);

      let tempLayer = this.props.map
        .findLayerById("baseMap")
        .allSublayers._items.find((x) => x.id == layer.layerId);

      if (tempLayer) {
        tempLayer.visible = true;
        let { layers } = this.state;
        layers.$legends[key].visible = true;
        this.setState({ layers });
      }
    }
  }
  componentDidMount() {
    var self = this;
    let { layers } = this.state;
    watchUtils.when(this.props.map.view, "stationary", (evt) => {
      if (evt) {
        var mapScale = this.props.map.view.scale;
        // visable layers in thier scale
        layers.$legends.forEach((layer) => {
          let minScale = layer.minScale;
          let maxScale = layer.maxScale;

          if (
            (maxScale <= mapScale || maxScale == 0) &&
            (minScale >= mapScale || minScale == 0)
          ) {
            layer.disable = "enableLabel";
          } else {
            layer.disable = "disableLabel";
          }
        });

        self.setState({ layers });
      }
    });
  }

  onSliderChange = (value) => {
    this.props.map.findLayerById("baseMap").opacity = value / 100;
  };

  render() {
    const { t } = this.props
    const legends = this.state.layers.$legends;
    return (
      <section className="toc">
        <div style={{ marginTop: "5px" }}>
          <label style={{ marginRight: "10px" }}>{t('Transparency')}</label>
          <div style={{ paddingLeft: "20px" }}>
            <Slider defaultValue={100} onChange={this.onSliderChange} />
          </div>
          <ul style={{ padding: "5px" }}>
            {legends.map((layer, key) => {
              return (
                !layer.isHidden &&
                this.props.mainData.layers[layer.layerName] && (
                  <li style={{ direction: i18n.language === 'ar' ? "rtl" : "ltr" }}>
                    <LayerComponent
                      mainData={this.props.mainData}
                      languageState={this.props.languageState}
                      galleryHead
                      {...{
                        layer,
                        changeLayer: this.changeLayer.bind(this, layer, key),
                        zoomToLayer: this.zoomToLayer.bind(this, layer, key),
                        expand: this.expand.bind(this, layer, key),
                      }}
                    />
                  </li>
                )
              );
            })}
          </ul>
        </div>
      </section>
    );
  }
}
export default withTranslation('common')(TocComponent);
