export const SEARCH_ENABLED_ROUTES = [
  '/',
  '/home'
];

export const shouldShowSearch = (pathname: string): boolean => {
  return SEARCH_ENABLED_ROUTES.includes(pathname);
};