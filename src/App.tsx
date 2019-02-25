import React, { Component } from "react";
import { InfiniteScrollView } from "./InfiniteScrollView";
import "./App.css";

const dataInitial = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const dataInitialAdd = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
const dataExtraAdd = [0, 1, 2, 3, 4, 15, 5, 6, 11, 7, 8, 9];

class App extends Component {
  state = {
    data: dataInitial,
    pivotKeySelector: `[data-val='2']`
  };

  render() {
    let pivotProp = {};
    if (this.state.pivotKeySelector) {
      pivotProp = {
        pivotKeySelector: this.state.pivotKeySelector
      };
    }
    return (
      <div className="App">
        <div className="AppScrollContainer">
          <InfiniteScrollView
            loadingComponentTop={<span>Loading...</span>}
            loadingComponentBottom={<span>Loading...</span>}
            {...pivotProp}
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
}

export default App;
