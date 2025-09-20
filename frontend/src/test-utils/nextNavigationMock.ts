// Minimal Next 13+ navigation mocks
export const useRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
});
export const usePathname = () => '/';
export const useSearchParams = () => new URLSearchParams();
