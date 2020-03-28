import React, { Component } from "react";
import { Viewer, createWorldTerrain, Color, Cartesian3 } from "cesium";
import CesiumManager from "./cesiumShapes/CesiumManager";
import { createRandomUUID, randomNumberFromInterval } from "./util/helper";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewer: undefined,
      data: {
        points: {
          uuid1: {
            id: "uuid1",
            position: {
              latitude: 40.03883,
              longitude: -75.59777
            },
            color: "#A35A00",
            pixelSize: 10,
            outlineColor: "#eeeeee",
            outlineWidth: 4
          }
        },
        polylines: {
          uuid2: {
            id: "uuid2",
            positions: [-75, 35, -125, 35],
            color: "#282c35",
            width: 5,
            points: {
              uuid3: {
                id: "uuid3",
                position: {
                  latitude: 35,
                  longitude: -75
                },
                color: "#A35A00",
                pixelSize: 10,
                outlineColor: "#eeeeee",
                outlineWidth: 4
              },
              uuid4: {
                id: "uuid4",
                position: {
                  latitude: 35,
                  longitude: -125
                },
                color: "#A35A00",
                pixelSize: 10,
                outlineColor: "#eeeeee",
                outlineWidth: 4
              }
            }
          }
        }
      }
    };
  }

  componentDidMount() {
    this.setState({
      viewer: new Viewer("cesiumContainer")
    });
  }

  componentWillUnmount() {
    const { viewer } = this.state;
    viewer.destroy();
  }

  addPoint = () => {
    const uuid = createRandomUUID();
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        points: {
          ...state.data.points,
          [uuid]: {
            id: uuid,
            position: {
              latitude: randomNumberFromInterval(20, 50),
              longitude: randomNumberFromInterval(-100, -50)
            },
            color: "#A35A00",
            pixelSize: 10,
            outlineColor: "#eeeeee",
            outlineWidth: 4
          }
        }
      }
    }));
  };

  onColorChange = e => {
    const color = e.target.value;
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        points: {
          uuid1: {
            ...state.data.points.uuid1,
            color
          }
        }
      }
    }));
  };

  onPixelSizeChange = e => {
    const pixelSize = parseInt(e.target.value);
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        points: {
          uuid1: {
            ...state.data.points.uuid1,
            pixelSize
          }
        }
      }
    }));
  };

  onOutlineColorChange = e => {
    const outlineColor = e.target.value;
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        points: {
          uuid1: {
            ...state.data.points.uuid1,
            outlineColor
          }
        }
      }
    }));
  };

  onOutlineWidthChange = e => {
    const outlineWidth = parseInt(e.target.value);
    this.setState(state => ({
      ...state,
      data: {
        ...state.data,
        points: {
          uuid1: {
            ...state.data.points.uuid1,
            outlineWidth
          }
        }
      }
    }));
  };

  render() {
    const { data, viewer } = this.state;

    return (
      <div className="App">
        <div
          id="cesiumContainer"
          style={{ width: 700, height: 800, backgroundColor: "red" }}
        >
          {!!viewer ? (
            <CesiumManager
              viewer={viewer}
              points={data.points}
              polylines={data.polylines}
            />
          ) : (
            undefined
          )}
        </div>

        <div>
          <input
            type="color"
            placeholder="Color"
            value={data.points.uuid1.color}
            onChange={this.onColorChange}
          />
          <input
            type="color"
            placeholder="Outline Color"
            value={data.points.uuid1.outlineColor}
            onChange={this.onOutlineColorChange}
          />
          <input
            type="number"
            placeholder="Outline Width"
            value={data.points.uuid1.outlineWidth}
            onChange={this.onOutlineWidthChange}
          />
          <input
            type="number"
            placeholder="Pixel Size"
            value={data.points.uuid1.pixelSize}
            onChange={this.onPixelSizeChange}
          />
        </div>
        <button onClick={this.addPoint}>Add Point</button>
      </div>
    );
  }
}

export default App;
