type Dock<T> = (() => Promise<T>) | Promise<T>;

export type DockResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: unknown };

type SequentialResponse<T> = AsyncGenerator<DockResult<T>, void, void>;
interface Sequential<T> {
    executeSequentially(): AsyncGenerator<DockResult<T>, void, void>;
    run(): Promise<void>;
}
type Options<T> = {
    tasks: Dock<T>[];
    throwErrors?: boolean;
    consumer?: (task: DockResult<T>) => void;
};

class Duckline<T> implements Sequential<T> {
    results: T[] = [];
    private _tasks: Dock<T>[] = [];
    private _throwErrors = false;
    private _consumer;

    constructor({ tasks, throwErrors = false, consumer }: Options<T>) {
        this._tasks.push(...tasks);
        this._throwErrors = throwErrors;
        this._consumer = consumer;
    }

    async *executeSequentially(): SequentialResponse<T> {
        for (let task of this._tasks) {
            try {
                const data = await (typeof task === 'function' ? task() : task);
                yield { ok: true, data };
            } catch (error) {
                if (this._throwErrors) {
                    throw error;
                }
                yield { ok: false, error };
            }
        }
    }

    async run(): Promise<void> {
        try {
            for await (const result of this.executeSequentially()) {
                if (result.ok) {
                    this._emit(result);
                    this.results.push(result.data);
                } else {
                    const error = result.error as Error;
                    this._emit(result);
                    console.log('Duckline: task failed 🦆 >>', error.message ?? error);
                }
            }
        } catch (error) {
            if (this._throwErrors) {
                throw error;
            }
        }
    }
    private _emit(result: DockResult<T>) {
        if (typeof this._consumer === 'function') {
            this._consumer(result);
        }
    }
}

export default Duckline;