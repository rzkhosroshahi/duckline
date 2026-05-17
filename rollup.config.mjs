import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";

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
        target: "ES2024",
        lib: ["ES2024", "DOM"],
        declaration: false,
        sourceMap: true,
      }),
      terser(),
    ],
  },
  {
    input,
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];

