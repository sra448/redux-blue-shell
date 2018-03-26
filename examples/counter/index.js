import React from "react";
import ReactDOM from "react-dom";
import { init } from "redux-blue-shell";

const model = {
  state: {
    count: 0
  },
  actions: {
    up: state => () => ({ count: state.count + 1 }),
    down: state => () => ({ count: state.count - 1 })
  },
  effects: {
    upDelayed: actions => () => setTimeout(actions.up, 500)
  }
};

const View = ({ state, actions, effects }) => (
  <div>
    <h1>{state.count}</h1>
    <button onClick={actions.down}>down</button>
    <button onClick={actions.up}>up</button>
    <button onClick={effects.upDelayed}>up later</button>
  </div>
);

const App = init(model, View);

ReactDOM.render(<App />, document.getElementById("root"));
