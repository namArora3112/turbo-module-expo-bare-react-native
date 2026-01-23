import { multiply, extensionVersion } from '../index';

describe('AepTurboCore', () => {
  it('multiplies two numbers', () => {
    expect(multiply(3, 7)).toBe(21);
  });

  it('returns extension version', async () => {
    const version = await extensionVersion();
    expect(version).toBe('1.0.0');
  });
});
