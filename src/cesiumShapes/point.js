import React, { memo, useEffect, useState, Fragment } from "react";
import { Cartesian3, HeightReference, Color } from "cesium";

import Polyline from "./polyline";
import Circle from "./circle";

const Point = memo(({ point, polylines, circles, viewer }) => {
  const { position, color, pixelSize, outlineColor, outlineWidth, id } = point;
  const [isFirstRun, setIsFirstRun] = useState(true);
  // Runs on the first mount
  useEffect(() => {
    viewer.entities.add({
      id,
      position: Cartesian3.fromDegrees(position.longitude, position.latitude),
      point: {
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        show: true,
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
      pointObj.point.color = Color.fromCssColorString(color);
      pointObj.point.pixelSize = pixelSize;
      pointObj.point.outlineColor = Color.fromCssColorString(outlineColor);
      pointObj.point.outlineWidth = outlineWidth;
      pointObj.position = Cartesian3.fromDegrees(
        position.longitude,
        position.latitude
      );
    }
  }, [position, color, pixelSize, outlineColor, outlineWidth, id, viewer]);

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
            />
          ))
        : null}
      {!!circles
        ? Object.keys(circles).map((circleUUID, index) => (
            <Circle key={index} circle={circles[circleUUID]} viewer={viewer} />
          ))
        : null}
    </Fragment>
  );
});

export default Point;
