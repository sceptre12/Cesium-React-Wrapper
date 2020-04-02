import React, { memo, useEffect, useState } from "react";
import { Cartesian3, Color, HeightReference } from "cesium";

const Circle = memo(({ circle, viewer, isParentSelected }) => {
  const {
    positions,
    radius,
    color,
    outlineColor,
    outlineWidth,
    id,
    isVisible
  } = circle;
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Runs on the first mount
  useEffect(() => {
    viewer.entities.add({
      id,
      position: Cartesian3.fromDegrees(positions.longitude, positions.latitude),
      show: !!isParentSelected ? true : isVisible,
      ellipse: {
        heightReference: HeightReference.CLAMP_TO_GROUND,
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
      pointObj.show = isVisible;
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
  }, [
    positions,
    isVisible,
    radius,
    color,
    outlineWidth,
    outlineColor,
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

  return null;
});

export default Circle;
