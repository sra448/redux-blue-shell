import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import jsx from "rollup-plugin-jsx";

export default {
  input: "src/index.js",
  output: {
    file: "build/redux-simple-app.js",
    format: "cjs"
  },
  plugins: [
    babel({
      exclude: "node_modules/**",
      plugins: ["transform-es2015-spread"]
    }),
    jsx({ factory: "React.createElement" }),
    resolve(),
    commonjs()
  ],
  external: ["react", "react-dom"]
};
