import Duckline from './index';

describe('Duckline', () => {
    test('runs tasks sequentially and collects successful results', async () => {
        const tasks = [
            () => Promise.resolve(1),
            () => Promise.resolve(2),
            Promise.resolve(3),
        ];

        const duckline = new Duckline<number>({ tasks });
        await duckline.run();

        expect(duckline.results).toEqual([1, 2, 3]);
    });

    test('yields failed results when throwErrors is false', async () => {
        const error = new Error('boom');
        const tasks = [() => Promise.resolve(1), () => Promise.reject(error)];

        const seen: unknown[] = [];
        const duckline = new Duckline<number>({
            tasks,
            throwErrors: false,
            consumer: (result) => seen.push(result),
        });

        await duckline.run();

        expect(duckline.results).toEqual([1]);
        expect(seen).toHaveLength(2);
        expect(seen[0]).toMatchObject({ ok: true, data: 1 });
        expect(seen[1]).toMatchObject({ ok: false, error });
    });
});

