export const sign = jest.fn(() => 'test.jwt.token');
export const verify = jest.fn(() => ({ sub: 1, email: 'alice@example.com' }));

export default { sign, verify };
