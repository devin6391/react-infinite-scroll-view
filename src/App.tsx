import React, { Component } from "react";
import { InfiniteScrollView, ScrollContainer } from "./InfiniteScrollView";
import "./App.css";

const dataInitial = [
  0,
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39
];
const dataInitialAdd = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const dataExtraAdd = [0, 1, 2, 3, 4, 15, 5, 6, 11, 7, 8, 9];

class App extends Component {
  state = {
    data: dataInitial,
    pivotKeySelector: `[data-val='2']`
  };

  render() {
    let restProps = {
      onReachEnd: this.onReachEnd,
      onAboutToReachEnd: this.onAboutToReachEnd,
      onExceedElements: this.onExceedElements,
      maxAllowedElemsBeyondViewPort: 10,
      minRequiredElementBeyondViewPort: 5,
      pivotKeySelector: this.state.pivotKeySelector,
      onFirstRender: this.onFirstRenderOfISV
    };
    return (
      <div className="App">
        <div className="AppScrollContainer">
          <InfiniteScrollView
            loadingComponentTop={<span>Loading...</span>}
            loadingComponentBottom={<span>Loading...</span>}
            {...restProps}
          >
            {this.sayChildren()}
          </InfiniteScrollView>
        </div>
      </div>
    );
  }

  private sayChildren = () => {
    return this.state.data.map(val => (
      <div className="singleData" key={val} data-val={val}>
        <span>{val}</span>
      </div>
    ));
  };

  private onReachEnd = (container: ScrollContainer) => {
    const windowEnd = container === ScrollContainer.TOP ? "TOP" : "Bottom";
    console.log(
      "%cScroll reached " + windowEnd + ".",
      "font-size: 20px; color: red"
    );
  };

  private onAboutToReachEnd = (container: ScrollContainer) => {
    const windowEnd = container === ScrollContainer.TOP ? "TOP" : "Bottom";
    console.log(
      "%cScroll is about to reach " + windowEnd + ".",
      "font-size: 20px; color: green"
    );
  };

  private onExceedElements = (container: ScrollContainer) => {
    const windowEnd = container === ScrollContainer.TOP ? "TOP" : "Bottom";
    console.log(
      "%cScroll is exceeding elements in " + windowEnd + ".",
      "font-size: 20px; color: blue"
    );
  };

  private onFirstRenderOfISV = () => {
    console.log("%c Hurray! ISV mounted", "font-size:20px; color: orange");
  };
}

export default App;
