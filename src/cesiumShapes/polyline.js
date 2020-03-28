import React, { memo, useEffect, useState, Fragment } from "react";
import { Cartesian3, Color } from "cesium";

import Point from "./point";

const Polyline = memo(({ points, polyline, viewer }) => {
  const { positions, color, width, id } = polyline;
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Runs on the first mount
  useEffect(() => {
    viewer.entities.add({
      id,
      polyline: {
        clampToGround: true,
        show: true,
        positions: Cartesian3.fromDegreesArray(positions),
        material: Color.fromCssColorString(color),
        width
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
      pointObj.polyline.material = Color.fromCssColorString(color);
      pointObj.polyline.width = width;
      pointObj.polyline.positions = Cartesian3.fromDegreesArray(positions);
    }
  }, [positions, color, width, id, viewer]);

  // Clean up viewer on unmount
  useEffect(
    () => () => {
      viewer.entities.removeById(id);
    },
    []
  );

  return (
    <Fragment>
      {!!points
        ? Object.keys(points).map((pointUUID, index) => (
            <Point key={index} point={points[pointUUID]} viewer={viewer} />
          ))
        : null}
    </Fragment>
  );
});

export default Polyline;
