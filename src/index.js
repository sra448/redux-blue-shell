import React from "react";
import { createStore } from "redux";
import {
  map,
  lensPath,
  view,
  over,
  type,
  mapObjIndexed,
  join,
  dropLast
} from "ramda";

const collapseModelLeaves = (name, obj) => {
  if (obj[name] !== undefined) {
    return obj[name];
  } else {
    const recur = map(x => (x[name] !== undefined ? x[name] : recur(x)));
    return recur(obj);
  }
};

const mapLeavesWithPath = (fn, obj, path = []) =>
  mapObjIndexed(
    (value, key) =>
      type(value) === "Object"
        ? mapLeavesWithPath(fn, value, [...path, key])
        : fn(value, [...path, key]),
    obj
  );

export const init = (model, View) => {
  const initialState = collapseModelLeaves("state", model);
  const actions = collapseModelLeaves("actions", model);
  const effects = collapseModelLeaves("effects", model);

  const reducer = (state = initialState, { type, args }) => {
    const path = type.split(".");
    const action = view(lensPath(path), actions);
    const modelStateLens = lensPath(dropLast(1, path));
    const modelState = view(modelStateLens, state);

    return action ? over(modelStateLens, action(modelState), state) : state;
  };

  const store = createStore(reducer);

  const actionCreators = mapLeavesWithPath(
    (_value, path) => (...args) => {
      store.dispatch({ args, type: join(".", path) });
    },
    actions
  );

  const effectCreators = mapLeavesWithPath((fn, path) => {
    const modelActionsLens = lensPath(dropLast(1, path));
    const actions = view(modelActionsLens, actionCreators);
    return fn(actions, store);
  }, effects);

  return class Container extends React.Component {
    constructor() {
      super();
      this.state = store.getState();
      store.subscribe(() => this.setState(store.getState()));
    }

    render() {
      return (
        <View
          state={this.state}
          actions={actionCreators}
          effects={effectCreators}
        />
      );
    }
  };
};
