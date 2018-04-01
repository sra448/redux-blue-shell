const React = require("react");
const renderer = require("react-test-renderer");

const { init } = require("../build/redux-blue-shell");

// simple nested app to test against

const model = {
  foo: {
    state: {
      count: 0
    },
    actions: {
      up: state => () => ({ count: state.count + 1 })
    },
    effects: {
      upDelayed: actions => () => setTimeout(actions.up, 1)
    }
  },
  bar: {
    state: {
      count: 100
    },
    actions: {
      up: state => () => ({ count: state.count + 1 })
    },
    effects: {
      upDelayed: actions => () => setTimeout(actions.up, 1)
    }
  }
};

const View = ({ state, actions, effects }) => (
  <div>
    <h1>{state.foo.count}</h1>
    <button onClick={actions.foo.up}>up</button>
    <button onClick={effects.foo.upDelayed}>up later</button>
    <h1>{state.bar.count}</h1>
    <button onClick={actions.bar.up}>up</button>
    <button onClick={effects.bar.upDelayed}>up later</button>
  </div>
);

// tests

test("nested simple model actions work as intended", () => {
  const App = init(model, View);
  const component = renderer.create(<App />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // trigger some actions
  tree.children[1].props.onClick();
  tree.children[1].props.onClick();
  tree.children[4].props.onClick();

  tree = component.toJSON();
  expect(tree.children[0].children[0]).toEqual("2");
  expect(tree).toMatchSnapshot();
});

test("nested simple model effects work as intended", () => {
  const App = init(model, View);
  const component = renderer.create(<App />);

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // trigger effects
  tree.children[2].props.onClick();
  tree.children[5].props.onClick();

  return new Promise((resolve, reject) => {
    setTimeout(resolve, 3);
  }).then(() => {
    tree = component.toJSON();
    expect(tree.children[3].children[0]).toEqual("101");
    expect(tree).toMatchSnapshot();
  });
});
