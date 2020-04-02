import React, { Component, Fragment } from "react";
import { Viewer } from "cesium";
import CesiumManager from "./cesiumShapes/CesiumManager";
import { createRandomUUID, randomNumberFromInterval } from "./util/helper";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      systemState: {
        isInEditMode: false,
        editedEntity: {}
      },
      viewer: undefined,
      data: {
        points: {
          uuid1: {
            id: "uuid1",
            name: "point1",
            isVisible: false,
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
        rectangles: {
          uuid7: {
            id: "uuid7",
            name: "rect1",
            isVisible: false,
            coordinates: [-110.0, 20.0, -80.0, 25.0],
            color: "#A35A00",
            outlineColor: "#eeeeee",
            outlineWidth: 4
          }
        },
        circles: {
          uuid9: {
            id: "uuid9",
            name: "circ1",
            isVisible: false,
            positions: {
              longitude: -103.0,
              latitude: 40.0
            },
            radius: 300000,
            color: "#A35A00",
            outlineColor: "#eeeeee",
            outlineWidth: 4
          }
        },
        polygons: {
          uuid8: {
            id: "uuid8",
            name: "polyg1",
            isVisible: false,
            positions: [
              -115.0,
              37.0,
              -115.0,
              32.0,
              -107.0,
              33.0,
              -102.0,
              31.0,
              -102.0,
              35.0
            ],
            color: "#A35A00",
            outlineColor: "#eeeeee",
            outlineWidth: 4
          }
        },
        polylines: {
          uuid2: {
            id: "uuid2",
            name: "polyl1",
            isVisible: false,
            positions: [-75, 35, -125, 35],
            color: "#282c35",
            width: 5,
            points: {
              uuid3: {
                id: "uuid3",
                name: "point3",
                isVisible: false,
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
                name: "point4",
                isVisible: false,
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
          ...state.data.points,
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
          ...state.data.points,
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
          ...state.data.points,
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
          ...state.data.points,
          uuid1: {
            ...state.data.points.uuid1,
            outlineWidth
          }
        }
      }
    }));
  };

  /**
   * Creates an unordered list of the data
   * For each new data
   */
  dataList = data => {
    return (
      <ul>
        {Object.keys(data).map((dataObj, index) => {
          let component = null;
          switch (dataObj) {
            case "points":
              component = Object.keys(data[dataObj]).map((pointUUID, key) => {
                const pointComponent = data[dataObj][pointUUID];
                let childComponent = [];
                if (pointComponent.circles) {
                  childComponent.push(this.dataList(pointComponent.circles));
                } else if (pointComponent.polylines) {
                  childComponent.push(this.dataList(pointComponent.polylines));
                }

                return (
                  <li>
                    {pointComponent.name}
                    {!!component
                      ? component.map((Child, index) => <Child key={index} />)
                      : null}
                  </li>
                );
              });
              break;
            case "polygons":
              break;
            case "polylines":
            case "rectangles":
            case "circles":
            default:
              component = <li>{data[dataObj].name}</li>;
              break;
          }
          return <Fragment>{component}</Fragment>;
        })}
      </ul>
    );
  };

  render() {
    const { data, viewer } = this.state;
    return (
      <div className="App">
        <div id="cesiumContainer">
          {!!viewer ? (
            <CesiumManager
              viewer={viewer}
              points={data.points}
              polylines={data.polylines}
              rectangles={data.rectangles}
              polygons={data.polygons}
              circles={data.circles}
            />
          ) : (
            undefined
          )}
        </div>
        <div id="itemMenu">
          <div id="dataList"></div>
          <div>
            <h3>Point Update</h3>
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
      </div>
    );
  }
}

export default App;
