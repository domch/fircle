const { getGreeting } = require('../index');

describe('getGreeting', () => {
  it('returns greeting with default name', () => {
    expect(getGreeting()).toBe('Hello Fircle!');
  });

  it('returns greeting with provided name', () => {
    expect(getGreeting('Alice')).toBe('Hello Alice!');
  });
});
