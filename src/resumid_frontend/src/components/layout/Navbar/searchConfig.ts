export const SEARCH_ENABLED_ROUTES = [
  '/',
  '/home',
  '/search'
];

export const SEARCH_MODE_ROUTES = [
  '/search'
];

export const shouldShowSearch = (pathname: string): boolean => {
  return SEARCH_ENABLED_ROUTES.includes(pathname);
};

export const isSearchMode = (pathname: string): boolean => {
  return SEARCH_MODE_ROUTES.includes(pathname);
};