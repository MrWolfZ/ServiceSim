import { applyDiff, createDiff, Diff } from './diff';

describe(createDiff.name, () => {

  it('should work for primitive types', () => {
    expect(createDiff('a', 'b')).toBe('b');
    expect(createDiff(1, 2)).toBe(2);
    expect(createDiff('a', undefined)).toBe(undefined);
  });

  describe(`for objects`, () => {

    it('should support updating primitive properties', () => {
      const orig = {
        a: 'a',
        b: 'b',
        c: 1,
        d: 2,
        e: undefined,
        f: undefined as undefined | null,
        g: undefined as undefined | string,
      };

      const updated: typeof orig = {
        a: 'a',
        b: 'b2',
        c: 1,
        d: 3,
        e: undefined,
        f: null,
        g: 'g',
      };

      const expectedDiff: Diff<typeof orig> = {
        b: 'b2',
        d: 3,
        f: null,
        g: 'g',
      };

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support updating complex properties', () => {
      const orig = {
        a: 'a',
        b: {
          c: 'c',
          d: 1,
        },
        e: [2, 3],
      };

      const updated: typeof orig = {
        a: 'a',
        b: {
          c: 'c2',
          d: 1,
        },
        e: [2, 3, 4],
      };

      const expectedDiff: Diff<typeof orig> = {
        b: {
          c: 'c2',
        },
        e: [{ index: 2, value: 4 }],
      };

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

  });

  describe(`for arrays`, () => {

    it('should support removing primitive elements', () => {
      const orig = [1, 2, 3, 4, 5];
      const updated: typeof orig = [1, 2, 4, 5];
      const expectedDiff: Diff<typeof orig> = [{ index: 2 }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support inserting primitive elements at the end', () => {
      const orig = [1, 2, 3, 4, 5];
      const updated: typeof orig = [1, 2, 3, 4, 5, 6];
      const expectedDiff: Diff<typeof orig> = [{ index: 5, value: 6 }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support inserting primitive elements in the middle', () => {
      const orig = [1, 2, 3, 4, 5];
      const updated: typeof orig = [1, 2, 3, 6, 4, 5];
      const expectedDiff: Diff<typeof orig> = [{ index: 3, value: 6 }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support inserting and removing primitive elements at the same time', () => {
      const orig = [1, 2, 3, 4, 5];
      const updated: typeof orig = [1, 2, 4, 6, 5];
      const expectedDiff: Diff<typeof orig> = [{ index: 2 }, { index: 3, value: 6 }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support updating primitive elements', () => {
      const orig = [1, 2, 3, 4, 5];
      const updated: typeof orig = [1, 2, 6, 4, 5];
      const expectedDiff: Diff<typeof orig> = [{ index: 2, diff: 6 }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support removing complex elements', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const updated: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a3', b: 3 }];
      const expectedDiff: Diff<typeof orig> = [{ index: 1 }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support inserting complex elements at the end', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }];
      const updated: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const expectedDiff: Diff<typeof orig> = [{ index: 2, value: { a: 'a3', b: 3 } }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support inserting complex elements in the middle', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a3', b: 3 }];
      const updated: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const expectedDiff: Diff<typeof orig> = [{ index: 1, value: { a: 'a2', b: 2 } }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support inserting and removing complex elements at the same time', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const updated: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a3', b: 3 }, { a: 'a4', b: 4 }];
      const expectedDiff: Diff<typeof orig> = [{ index: 1 }, { index: 2, value: { a: 'a4', b: 4 } }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support updating complex elements', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const updated: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a4', b: 2 }, { a: 'a3', b: 3 }];
      const expectedDiff: Diff<typeof orig> = [{ index: 1, diff: { a: 'a4' } }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support inserting and updating complex elements at the same time', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const updated: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a4', b: 4 }, { a: 'a3', b: 3 }, { a: 'a5', b: 5 }];
      const expectedDiff: Diff<typeof orig> = [{ index: 1, diff: { a: 'a4', b: 4 } }, { index: 3, value: { a: 'a5', b: 5 } }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

    it('should support updating and removing complex elements at the same time', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const updated: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a4', b: 4 }];
      const expectedDiff: Diff<typeof orig> = [{ index: 1, diff: { a: 'a4', b: 4 } }, { index: 2 }];

      expect(createDiff(orig, updated)).toEqual(expectedDiff);
    });

  });

});

describe(applyDiff.name, () => {

  it('should work for primitive types', () => {
    expect(applyDiff('a' as string, 'b')).toBe('b');
    expect(applyDiff(1 as number, 2)).toBe(2);
    expect(applyDiff('a' as string | undefined, undefined)).toBe(undefined);
  });

  describe(`for objects`, () => {

    it('should support updating primitive properties', () => {
      const orig = {
        a: 'a',
        b: 'b',
        c: 1,
        d: 2,
        e: undefined,
        f: undefined as undefined | null,
        g: undefined as undefined | string,
      };

      const diff: Diff<typeof orig> = {
        b: 'b2',
        d: 3,
        f: null,
        g: 'g',
      };

      const expected = {
        a: 'a',
        b: 'b2',
        c: 1,
        d: 3,
        e: undefined,
        f: null,
        g: 'g',
      };

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support updating complex properties', () => {
      const orig = {
        a: 'a',
        b: {
          c: 'c',
          d: 1,
        },
        e: [2, 3],
      };

      const diff: Diff<typeof orig> = {
        b: {
          c: 'c2',
        },
        e: [{ index: 2, value: 4 }],
      };

      const expected = {
        a: 'a',
        b: {
          c: 'c2',
          d: 1,
        },
        e: [2, 3, 4],
      };

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

  });

  describe(`for arrays`, () => {

    it('should support removing primitive elements', () => {
      const orig = [1, 2, 3, 4, 5];
      const diff: Diff<typeof orig> = [{ index: 2 }];
      const expected: typeof orig = [1, 2, 4, 5];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support inserting primitive elements at the end', () => {
      const orig = [1, 2, 3, 4, 5];
      const diff: Diff<typeof orig> = [{ index: 5, value: 6 }];
      const expected: typeof orig = [1, 2, 3, 4, 5, 6];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support inserting primitive elements in the middle', () => {
      const orig = [1, 2, 3, 4, 5];
      const diff: Diff<typeof orig> = [{ index: 3, value: 6 }];
      const expected: typeof orig = [1, 2, 3, 6, 4, 5];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support inserting and removing primitive elements at the same time', () => {
      const orig = [1, 2, 3, 4, 5];
      const diff: Diff<typeof orig> = [{ index: 2 }, { index: 3, value: 6 }];
      const expected: typeof orig = [1, 2, 4, 6, 5];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support updating primitive elements', () => {
      const orig = [1, 2, 3, 4, 5];
      const diff: Diff<typeof orig> = [{ index: 2, diff: 6 }];
      const expected: typeof orig = [1, 2, 6, 4, 5];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support removing complex elements', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const diff: Diff<typeof orig> = [{ index: 1 }];
      const expected: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a3', b: 3 }];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support inserting complex elements at the end', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }];
      const diff: Diff<typeof orig> = [{ index: 2, value: { a: 'a3', b: 3 } }];
      const expected: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support inserting complex elements in the middle', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a3', b: 3 }];
      const diff: Diff<typeof orig> = [{ index: 1, value: { a: 'a2', b: 2 } }];
      const expected: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support inserting and removing complex elements at the same time', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const diff: Diff<typeof orig> = [{ index: 1 }, { index: 2, value: { a: 'a4', b: 4 } }];
      const expected: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a3', b: 3 }, { a: 'a4', b: 4 }];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support updating complex elements', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const diff: Diff<typeof orig> = [{ index: 1, diff: { a: 'a4' } }];
      const expected: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a4', b: 2 }, { a: 'a3', b: 3 }];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support inserting and updating complex elements at the same time', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const diff: Diff<typeof orig> = [{ index: 1, diff: { a: 'a4', b: 4 } }, { index: 3, value: { a: 'a5', b: 5 } }];
      const expected: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a4', b: 4 }, { a: 'a3', b: 3 }, { a: 'a5', b: 5 }];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

    it('should support updating and removing complex elements at the same time', () => {
      const orig = [{ a: 'a1', b: 1 }, { a: 'a2', b: 2 }, { a: 'a3', b: 3 }];
      const diff: Diff<typeof orig> = [{ index: 1, diff: { a: 'a4', b: 4 } }, { index: 2 }];
      const expected: typeof orig = [{ a: 'a1', b: 1 }, { a: 'a4', b: 4 }];

      expect(applyDiff(orig, diff)).toEqual(expected);
    });

  });

});
