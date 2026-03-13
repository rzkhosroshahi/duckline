import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

const input = "index.ts";

/** @type {import("rollup").RollupOptions[]} */
export default [
  {
    input,
    output: [
      {
        file: "dist/index.cjs.js",
        format: "cjs",
        exports: "auto",
        sourcemap: true,
      },
      {
        file: "dist/index.esm.js",
        format: "es",
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
        target: "ES5",
        lib: ["ES2018", "ES2018.AsyncIterable", "DOM"],
        declaration: false,
        sourceMap: true,
      }),
    ],
  },

  {
    input,
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];

