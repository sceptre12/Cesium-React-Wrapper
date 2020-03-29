import React, { Component, Fragment } from "react";
import Point from "./point";
import Polyline from "./polyline";
import Polygon from "./polygon";
import RectangleContainer from "./rectangle";
import Circle from "./circle";

class CesiumManager extends Component {
  static getDerivedStateFromError(error) {
    console.error("derrived error state", error);
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error", error);
    console.log("Error info", errorInfo);
  }

  render() {
    const {
      points,
      viewer,
      polylines,
      rectangles,
      polygons,
      circles
    } = this.props;
    return (
      <Fragment>
        {!!points
          ? Object.keys(points).map((pointUUID, index) => (
              <Point key={index} point={points[pointUUID]} viewer={viewer} />
            ))
          : null}
        {!!polylines
          ? Object.keys(polylines).map((polylineUUID, index) => (
              <Polyline
                key={index}
                points={polylines[polylineUUID].points}
                polyline={polylines[polylineUUID]}
                viewer={viewer}
              />
            ))
          : null}
        {!!rectangles
          ? Object.keys(rectangles).map((rectangleUUID, index) => (
              <RectangleContainer
                key={index}
                rectangle={rectangles[rectangleUUID]}
                viewer={viewer}
              />
            ))
          : null}
        {!!polygons
          ? Object.keys(polygons).map((polygonUUID, index) => (
              <Polygon
                key={index}
                polygon={polygons[polygonUUID]}
                viewer={viewer}
              />
            ))
          : null}
        {!!circles
          ? Object.keys(circles).map((circleUUID, index) => (
              <Circle
                key={index}
                circle={circles[circleUUID]}
                viewer={viewer}
              />
            ))
          : null}
      </Fragment>
    );
  }
}

export default CesiumManager;
