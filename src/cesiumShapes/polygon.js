import React, { memo, useEffect, useState } from "react";
import { Cartesian3, Color, HeightReference } from "cesium";

const Polygon = memo(({ polygon, viewer }) => {
  const {
    positions,
    color,
    outlineColor,
    outlineWidth,
    id,
    isVisible
  } = polygon;
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Runs on the first mount
  useEffect(() => {
    viewer.entities.add({
      id,
      show: isVisible,
      polygon: {
        heightReference: HeightReference.CLAMP_TO_GROUND,
        hierarchy: Cartesian3.fromDegreesArray(positions),
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
      pointObj.polygon.material = Color.fromCssColorString(color);
      pointObj.polygon.outlineWidth = outlineWidth;
      pointObj.polygon.outlineColor = Color.fromCssColorString(outlineColor);
      pointObj.polygon.hierarchy = Cartesian3.fromDegreesArray(positions);
    }
  }, [positions, isVisible, color, outlineWidth, outlineColor, id, viewer]);

  // Clean up viewer on unmount
  useEffect(
    () => () => {
      viewer.entities.removeById(id);
    },
    []
  );

  return null;
});

export default Polygon;
