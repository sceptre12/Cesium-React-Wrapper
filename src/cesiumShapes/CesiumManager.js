import React, { Component, Fragment } from "react";
import Point from "./point";
import Polyline from "./polyline";

class CesiumManager extends Component {
  static getDerivedStateFromError(error) {
    console.error("derrived error state", error);
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error", error);
    console.log("Error info", errorInfo);
  }

  render() {
    const { points, viewer, polylines } = this.props;
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
      </Fragment>
    );
  }
}

export default CesiumManager;
