export const SEARCH_ENABLED_ROUTES = [
  '/',
  '/home',
  '/search'
];

export const shouldShowSearch = (pathname: string): boolean => {
  return SEARCH_ENABLED_ROUTES.includes(pathname);
};