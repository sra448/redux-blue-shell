const React = require("react");
const renderer = require("react-test-renderer");

const { init } = require("../build/redux-blue-shell");

// simple counter app to test against

const model = {
  state: {
    count: 0
  },
  actions: {
    up: state => () => ({ count: state.count + 1 }),
    down: state => () => ({ count: state.count - 1 })
  },
  effects: {
    upDelayed: actions => () => setTimeout(actions.up, 10)
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

// tests

test("unnested simple model actions work as intended", () => {
  const App = init(model, View);
  const component = renderer.create(<App />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // trigger some actions
  tree.children[2].props.onClick();
  tree.children[1].props.onClick();
  tree.children[2].props.onClick();

  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});

test("unnested simple model effects work as intended", () => {
  const App = init(model, View);
  const component = renderer.create(<App />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // trigger effect
  tree.children[3].props.onClick();

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 10);
  }).then(() => {
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
