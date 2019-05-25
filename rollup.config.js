import nodeResolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  plugins: [
    nodeResolve(),
    commonjs(),
    typescript({
      rollupCommonJSResolveHack: true,
    }),
    babel({
      exclude: "node_modules/**",
      extensions: ["ts"],
    }),
  ],
  external: ["fs", "os"],
  output: [
    {
      globals: {
        "date-and-time": "date-and-time",
      },
      format: "cjs",
      file: "dist/whatsapp-to-html.js",
    },
    {
      globals: {
        "date-and-time": "date-and-time",
      },
      format: "esm",
      file: "dist/whatsapp-to-html.es.js",
    },
  ],
};
