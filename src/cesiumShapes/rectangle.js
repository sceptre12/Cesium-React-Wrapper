import React, { memo, useEffect, useState } from "react";
import { Rectangle, Color, HeightReference } from "cesium";

const RectangleContainer = memo(({ rectangle, viewer }) => {
  const { coordinates, color, outlineColor, outlineWidth, id } = rectangle;
  const [isFirstRun, setIsFirstRun] = useState(true);

  // Runs on the first mount
  useEffect(() => {
    viewer.entities.add({
      id,
      rectangle: {
        heightReference: HeightReference.CLAMP_TO_GROUND,
        show: true,
        coordinates: Rectangle.fromDegrees(...coordinates),
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
      pointObj.rectangle.material = Color.fromCssColorString(color);
      pointObj.rectangle.outlineWidth = outlineWidth;
      pointObj.rectangle.outlineColor = Color.fromCssColorString(outlineColor);
      pointObj.rectangle.coordinates = Rectangle.fromDegreesArray(coordinates);
    }
  }, [coordinates, color, outlineWidth, outlineColor, id, viewer]);

  // Clean up viewer on unmount
  useEffect(
    () => () => {
      viewer.entities.removeById(id);
    },
    []
  );

  return null;
});

export default RectangleContainer;
