# Redux Simple App

Redux Simple App is a simple but opinionated way to build apps with React and Redux. It is inspired by [Hyperapp](https://hyperapp.js.org/), [Elm](http://elm-lang.org/) and [Rematch](https://rematch.gitbooks.io/rematch/#getting-started).

## Install

The following does not work, but hopefully will soon

```
npm install redux-simple-app --save
```

## Getting Started

In Redux Simple App you define **models** which hold internal **state** that can be transformed by **actions** that themselves can be triggered by your view or by an **effect**.

* **State**: An object that contains this models internal knowledge
* **Actions**: Functions that you can call directly from within your view. They will transform the state.
* **Effects**: Basically actions that cannot alter the state but can call actual actions. This is where your asynchronous stuff lives

### Example

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { init } from "./redux-simple";

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
```

## Nesting Models

should work as expected

## Roadmap

* add tests
* add `connect` function
* add possibility to subscribe to actions in different models
* add to `npm`
* create a documentation / page
