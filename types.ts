export type Dock<T> = (() => Promise<T>) | Promise<T>;

export type DockResult<T> =
    | { ok: true; data: T }
    | { ok: false; error: unknown };

export type SequentialResponse<T> = AsyncGenerator<DockResult<T>, void, void>;

export interface Sequential<T> {
    execute(): AsyncGenerator<DockResult<T>, void, void>;
    run(): Promise<void>;
}

export type Options<T> = {
    tasks: Dock<T>[];
    throwErrors?: boolean;
    consumer?: (task: DockResult<T>) => void;
};
