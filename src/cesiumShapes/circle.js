import React, { memo, useEffect, useState } from "react";
import { Cartesian3, Color, HeightReference } from "cesium";

const Circle = memo(({ circle, viewer }) => {
  const { positions, radius, color, outlineColor, outlineWidth, id } = circle;
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Runs on the first mount
  useEffect(() => {
    viewer.entities.add({
      id,
      position: Cartesian3.fromDegrees(positions.longitude, positions.latitude),
      ellipse: {
        heightReference: HeightReference.CLAMP_TO_GROUND,
        show: true,
        semiMinorAxis: radius,
        semiMajorAxis: radius,
        material: Color.fromCssColorString(color),
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
      pointObj.position = Cartesian3.fromDegrees(
        positions.longitude,
        positions.latitude
      );
      pointObj.polygon.semiMinorAxis = radius;
      pointObj.polygon.semiMajorAxis = radius;
      pointObj.polygon.material = Color.fromCssColorString(color);
      pointObj.polygon.outlineWidth = outlineWidth;
      pointObj.polygon.outlineColor = Color.fromCssColorString(outlineColor);
      pointObj.polygon.hierarchy = Cartesian3.fromDegreesArray(positions);
    }
  }, [positions, radius, color, outlineWidth, outlineColor, id, viewer]);

  // Clean up viewer on unmount
  useEffect(
    () => () => {
      viewer.entities.removeById(id);
    },
    []
  );

  return null;
});

export default Circle;
