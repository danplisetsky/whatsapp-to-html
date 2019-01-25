import babel from "rollup-plugin-babel";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts",
  plugins: [
    typescript({
      rollupCommonJSResolveHack: true
    }),
    babel({
      exclude: "node_modules/**",
      extensions: ["ts"]
    })
  ],
  external: ["fs", "os"],
  output: {
    file: "lib/bundle.js",
    format: "cjs"
  }
};
