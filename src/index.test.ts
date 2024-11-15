import { greet } from './index';

describe('greet function', () => {
  it('should return a greeting message with the given name', () => {
    const name = "TypeScript User";
    const expectedGreeting = "Hello, TypeScript User!";
    expect(greet(name)).toBe(expectedGreeting);
  });

  it('should handle an empty string as a name', () => {
    const name = "";
    const expectedGreeting = "Hello, !";
    expect(greet(name)).toBe(expectedGreeting);
  });
});