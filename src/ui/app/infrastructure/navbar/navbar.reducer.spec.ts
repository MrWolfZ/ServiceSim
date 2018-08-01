import { navbarReducer } from './navbar.reducer';

describe(navbarReducer.name, () => {
  it('should return the initial state when called with undefined state', () => {
    expect(navbarReducer(undefined, { type: 'INIT' } as any)).toBeDefined();
  });
});
