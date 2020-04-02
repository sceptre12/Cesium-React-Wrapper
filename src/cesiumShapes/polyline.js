import React, { memo, useEffect, useState, Fragment } from "react";
import { Cartesian3, Color } from "cesium";

import Point from "./point";

const Polyline = memo(({ points, polyline, viewer, isParentSelected }) => {
  const { positions, color, width, id, isVisible } = polyline;
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Runs on the first mount
  useEffect(() => {
    viewer.entities.add({
      id,
      show: !!isParentSelected ? true : isVisible,
      polyline: {
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
      pointObj.show = isVisible;
      pointObj.polyline.positions = Cartesian3.fromDegreesArray(positions);
    }
  }, [positions, isVisible, color, width, id, viewer]);

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
            <Point
              key={index}
              point={points[pointUUID]}
              viewer={viewer}
              isParentSelected={isVisible}
            />
          ))
        : null}
    </Fragment>
  );
});

export default Polyline;
