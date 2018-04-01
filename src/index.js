import React from "react";
import { createStore } from "redux";
import { lensPath, view, over, type, dropLast } from "ramda";
import { collapseModelLeaves, mapLeavesWithPath } from "./utils";

const createContainer = (View, store, actionCreators, effectCreators) => {
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

const createReducer = (actions, initialState) => (
  state = initialState,
  { type, args }
) => {
  const path = type.split(".");
  const action = view(lensPath(path), actions);
  const modelStateLens = lensPath(dropLast(1, path));
  const modelState = view(modelStateLens, state);

  return action
    ? over(modelStateLens, () => action(modelState)(...args), state)
    : state;
};

export const init = (model, View) => {
  const initialState = collapseModelLeaves("state", model);
  const actions = collapseModelLeaves("actions", model);
  const effects = collapseModelLeaves("effects", model);

  const reducer = createReducer(actions, initialState);
  const store = createStore(reducer);

  const actionCreators = mapLeavesWithPath(
    (_action, path) => (...args) => {
      store.dispatch({ args, type: path.join(".") });
    },
    actions
  );

  const effectCreators = mapLeavesWithPath((fn, path) => {
    const modelActionsLens = lensPath(dropLast(1, path));
    const actions = view(modelActionsLens, actionCreators);
    return fn(actions, store);
  }, effects);

  return createContainer(View, store, actionCreators, effectCreators);
};
