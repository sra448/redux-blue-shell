# ![Blue shell logo](assets/blue-shell.png) Redux Blue Shell

Redux Blue Shell is a simple way to build apps using React and Redux, inspired by [Hyperapp](https://hyperapp.js.org/), [Elm](http://elm-lang.org/) and [Rematch](https://rematch.gitbooks.io/rematch/#getting-started).

---

[![Maintainability](https://api.codeclimate.com/v1/badges/ce71bd86f49fa8e9fd22/maintainability)](https://codeclimate.com/github/sra448/redux-blue-shell/maintainability)

## Install

The following does not work, but might someday

```
npm install redux-blue-shell react react-dom --save
```

## Getting started

In Redux Blue Shell you organize your state into **models** where you also put the **actions** and **effects** that can access and transform this state.

But first we need to grab some dependencies

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { init } from "redux-blue-shell";
```

Now lets define our model. It's going to be a simple counter app.

```jsx
const model = {
  state: {
    count: 0
  },
  actions: {
    up: state => (n = 1) => ({ count: state.count + n }),
    down: state => (n = 1) => ({ count: state.count - n })
  },
  effects: {
    upDelayed: actions => () => setTimeout(actions.up, 1000)
  }
};
```

Next we'll define our top-level react component. Blue Shell will induce the models state, actions and effects as props into this component.

```jsx
const View = ({ state, actions, effects }) => (
  <div>
    <h1>{state.count}</h1>
    <button onClick={() => actions.down()}>down</button>
    <button onClick={() => actions.up()}>up</button>
    <button onClick={() => actions.up(10)}>up more</button>
    <button onClick={effects.upDelayed}>up later</button>
  </div>
);
```

Lastly we init Blue Shell with our model and view. Then we render the app.

```jsx
const App = init(model, View);
ReactDOM.render(<App />, document.getElementById("root"));
```

Et voila, our first Blue Shell app is complete

## Nesting Models

You can nest models to help structure your app in ways you see fit.

```jsx
const model = {
  authentication: autheticationModel,
  feature1: feature1Model,
  bigFeature2: {
    feature2a: feature2aModel,
    feature2b: feature2bModel
  }
};
```

## Roadmap

* add more tests
* add a `connect` function
* add possibility to subscribe to actions in different models
* look into support for Preact
* create a documentation / page
