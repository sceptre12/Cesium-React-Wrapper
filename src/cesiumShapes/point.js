import React, { memo, useEffect, useState, Fragment } from "react";
import { Cartesian3, HeightReference, Color } from "cesium";

import Polyline from "./polyline";
import Circle from "./circle";

const Point = memo(
  ({ point, polylines, circles, viewer, isParentSelected }) => {
    const {
      position,
      color,
      pixelSize,
      outlineColor,
      outlineWidth,
      id,
      isVisible
    } = point;
    const [isFirstRun, setIsFirstRun] = useState(true);
    // Runs on the first mount
    useEffect(() => {
      viewer.entities.add({
        id,
        position: Cartesian3.fromDegrees(position.longitude, position.latitude),
        show: !!isParentSelected ? true : isVisible,
        point: {
          heightReference: HeightReference.RELATIVE_TO_GROUND,

          color: Color.fromCssColorString(color),
          pixelSize,
          outlineColor: Color.fromCssColorString(outlineColor),
          outlineWidth
        }
      });
      setIsFirstRun(false);
    }, []);

    /**
     * Updates the cesium entity when any of the properties passed to the
     * dependency array is updated
     */
    useEffect(() => {
      if (!!viewer && !isFirstRun) {
        let pointObj = viewer.entities.getById(id);
        pointObj.show = isVisible;
        pointObj.point.color = Color.fromCssColorString(color);
        pointObj.point.pixelSize = pixelSize;
        pointObj.point.outlineColor = Color.fromCssColorString(outlineColor);
        pointObj.point.outlineWidth = outlineWidth;
        pointObj.position = Cartesian3.fromDegrees(
          position.longitude,
          position.latitude
        );
      }
    }, [
      position,
      isVisible,
      color,
      pixelSize,
      outlineColor,
      outlineWidth,
      id,
      viewer
    ]);

    // Clean up viewer on unmount
    useEffect(
      () => () => {
        viewer.entities.removeById(id);
      },
      []
    );

    return (
      <Fragment>
        {!!polylines
          ? Object.keys(polylines).map((polylineUUID, index) => (
              <Polyline
                key={index}
                polyline={polylines[polylineUUID]}
                viewer={viewer}
                isParentSelected={isParentSelected}
              />
            ))
          : null}
        {!!circles
          ? Object.keys(circles).map((circleUUID, index) => (
              <Circle
                key={index}
                circle={circles[circleUUID]}
                viewer={viewer}
                isParentSelected={isParentSelected}
              />
            ))
          : null}
      </Fragment>
    );
  }
);

export default Point;
