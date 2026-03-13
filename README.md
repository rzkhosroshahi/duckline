# Duckline

[![bundle size](https://img.shields.io/bundlephobia/minzip/duckline)](https://bundlephobia.com/package/duckline)

Run a list of async tasks **sequentially** and collect results.
🦆🦆🦆🦆

## Install

```bash
npm i duckline
```

For local development in this repo:

```bash
npm i
npm run build
```

Build outputs:

- `dist/index.cjs.js` (CommonJS, ES5)
- `dist/index.esm.js` (ESM, ES5)
- `dist/index.d.ts` (TypeScript declarations)

## API

```ts
import Duckline, { type DockResult } from "duckline";

type DucklineOptions<T> = {
  tasks: Array<(() => Promise<T>) | Promise<T>>;
  throwErrors?: boolean;
  consumer?: (task: DockResult<T>) => void;
};
```

- **`new Duckline({ tasks, throwErrors, consumer })`**: create a runner.
- **`duck.run()`**: executes tasks sequentially.
- **`duck.results`**: array of successful task results (in order).

## Examples

### Example 1: run tasks and collect successful results

```ts
import Duckline from "duckline";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const duck = new Duckline<number>({
  tasks: [
    async () => {
      await sleep(50);
      return 1;
    },
    Promise.resolve(2),
    async () => 3,
  ],
});

await duck.run();
console.log(duck.results); // [1, 2, 3]
```

### Example 2: handle failures without throwing + observe each task

```ts
import Duckline, { type DockResult } from "duckline";

const duck = new Duckline<string>({
  tasks: [
    async () => "ok-1",
    async () => {
      throw new Error("boom");
    },
    Promise.resolve("ok-2"),
  ],
  throwErrors: false,
  consumer: (result: DockResult<string>) => {
    if (result.ok) {
      console.log("consumer ok:", result.data);
    } else {
      console.log("consumer failed:", result.error);
    }
  },
});

await duck.run();
console.log("successful results:", duck.results); // ["ok-1", "ok-2"]
```

### Example 3: stop on first failure (`throwErrors: true`)

```ts
import Duckline from "duckline";

const duck = new Duckline<string>({
  tasks: [
    async () => "ok",
    async () => {
      throw new Error("stop here");
    },
    async () => "never reached",
  ],
  throwErrors: true,
});

await duck.run(); // throws Error("stop here")
```

