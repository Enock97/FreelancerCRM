export const compare = jest.fn(async () => true);
export const hash = jest.fn(async (val: string) => `hash:${val}`);

export default { compare, hash };
