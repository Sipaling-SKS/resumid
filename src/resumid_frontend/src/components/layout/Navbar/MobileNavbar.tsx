import Logo from "@/assets/logo-black.svg";
import SearchBar, { SearchBarRef } from "@/components/parts/SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { cn, scrollToTop, scrollTo, shorten, truncate } from "@/lib/utils";
import { Menu, X as Close, LogOut, User2 as ProfileIcon, Search, ArrowLeft, Wallet } from "lucide-react";
import { NavLink } from "react-router";
import { useState, useRef } from "react";
import { shouldShowSearch, isSearchMode } from "./searchConfig";

function MobileNavbar({ navigate, isOpen, setIsOpen }: any) {
  const { isAuthenticated, login, logout, userData } = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const showSearch = shouldShowSearch(location.pathname) && isAuthenticated;
  const searchMode = isSearchMode(location.pathname);
  const searchBarRef = useRef<SearchBarRef>(null);

  const basePinataUrl = import.meta.env.VITE_PINATA_GATEWAY_URL;
  const avatarCid = userData?.profile?.profileCid || null;
  const avatarUrl = avatarCid ? `${basePinataUrl}/ipfs/${avatarCid}` : null;
  const userName = userData?.profile?.name || userData?.user?.name || "User";
  const userRole = userData?.profile?.current_position || "No Position";

  const handleSearchToggle = () => {
    if (searchMode) {
      navigate("/", { replace: true });
      searchBarRef.current?.reset();
      setIsSearchExpanded(false);
    } else {
      setIsSearchExpanded(!isSearchExpanded);
    }
  };

  if (searchMode && isAuthenticated) {
    return (
      <>
        <div className={cn("fixed flex flex-col h-screen min-w-fit w-1/2 max-w-64 pb-[4vh] z-50 top-0 bottom-0 bg-white border-l border-neutral-200 transition-all duration-500 ease-in-out", isOpen ? "right-0" : "-right-full")}>
          <div className="px-4 h-[65px] flex-shrink-0 inline-flex items-center justify-end w-full border-b border-neutral-200">
            <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="">
              <Close size={48} />
            </Button>
          </div>
          <ul className="flex flex-col items-center justify-center h-full p-4 gap-[4vh] text-lg">
            <NavLink
              to="/"
              onClick={() => {
                if (window.location.pathname === "/") {
                  scrollToTop();
                }
                setIsOpen(false);
              }}
              className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
            >
              Home
            </NavLink>
            <NavLink
              to="/result"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
            >
              Results
            </NavLink>
            <NavLink
              to="/resume-analyzer"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
            >
              Resume Analyzer
            </NavLink>
          </ul>
          <div className="inline-flex gap-2 p-4 border-t border-b border-neutral-200 items-center justify-between">
            <div className="inline-flex gap-2 items-center min-w-0 flex-1">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-paragraph font-medium">{truncate(userName, 12)}</p>
                <p className="text-xs text-gray-500 truncate" title={userRole}>
                  {userRole}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer p-[2px] rounded-full bg-transparent hover:bg-primary-500 transition-colors">
                  <Avatar className="border-2 border-white w-11 h-11">
                    <AvatarImage
                      src={avatarUrl || `https://ui-avatars.com/api/?name=${userName}&background=225adf&color=f4f4f4`}
                    />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-paragraph m-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                  navigate(`/profile/${userData?.profile.profileId}`);
                  setIsOpen(false);
                }}>
                  <ProfileIcon />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-500" >
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isOpen && <div onClick={() => setIsOpen(false)} className="fixed top-0 left-0 w-full h-full z-40" />}

        <div className="relative inline-flex items-center justify-between gap-2 w-full">
          <div className="flex items-center gap-3 flex-1">
            <Button
              onClick={handleSearchToggle}
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="flex-1">
              <SearchBar ref={searchBarRef} />
            </div>
          </div>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
          >
            <Menu size={24} />
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={cn("fixed flex flex-col h-screen min-w-fit w-1/2 max-w-64 pb-[4vh] z-50 top-0 bottom-0 bg-white border-l border-neutral-200 transition-all duration-500 ease-in-out", isOpen ? "right-0" : "-right-full")}>
        <div className="px-4 h-[65px] flex-shrink-0 inline-flex items-center justify-end w-full border-b border-neutral-200">
          <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="">
            <Close size={48} />
          </Button>
        </div>
        <ul className="flex flex-col items-center justify-center h-full p-4 gap-[4vh] text-lg">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    scrollToTop();
                  }
                  setIsOpen(false);
                }}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Home
              </NavLink>
              <Button
                onClick={() => {
                  scrollTo('features', 73);
                  setIsOpen(false);
                }}
                variant="link"
                size="lg"
                className="p-2"
              >
                Features
              </Button>
              <Button
                onClick={() => {
                  scrollTo('pricing', 73);
                  setIsOpen(false);
                }}
                variant="link"
                size="lg"
                className="p-2"
              >
                Pricing
              </Button>
              <Button
                onClick={() => {
                  login();
                  setIsOpen(false)
                }}
                variant="gradient"
                size="lg"
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    scrollToTop();
                  }
                  setIsOpen(false);
                }}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Home
              </NavLink>
              <NavLink
                to="/result"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Results
              </NavLink>
              <NavLink
                to="/resume-analyzer"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Resume Analyzer
              </NavLink>
            </>
          )}
        </ul>
        {isAuthenticated && (
          <div className="inline-flex gap-2 p-4 border-t border-b border-neutral-200 items-center justify-between">
            <div className="inline-flex gap-2 items-center min-w-0 flex-1">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-paragraph font-medium">{truncate(userName, 12)}</p>
                <p className="text-xs text-gray-500 truncate" title={userRole}>
                  {userRole}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer p-[2px] rounded-full bg-transparent hover:bg-primary-500 transition-colors">
                  <Avatar className="border-2 border-white w-11 h-11">
                    <AvatarImage
                      src={avatarUrl || `https://ui-avatars.com/api/?name=${userName}&background=225adf&color=f4f4f4`}
                    />
                    <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-paragraph m-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                  navigate(`/profile/${userData?.profile.profileId}`);
                  setIsOpen(false);
                }}>
                  <ProfileIcon />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => {
                  navigate(`/profile/${userData?.profile.profileId}`);
                  setIsOpen(false);
                }}>
                  <ProfileIcon />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    navigate("/wallet");
                    setIsOpen(false);
                  }}
                >
                  <Wallet />
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-500" >
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed top-0 left-0 w-full h-full z-40" />}
      <div className="relative inline-flex items-center justify-between gap-2 w-full">
        {showSearch && isSearchExpanded ? (
          <>
            <Button
              onClick={handleSearchToggle}
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
            >
              <ArrowLeft size={24} />
            </Button>
            <div className="flex-1">
              <SearchBar ref={searchBarRef} />
            </div>
          </>
        ) : (
          <>
            <img
              onClick={() => navigate("/")}
              src={Logo}
              alt="Logo Resumid"
              className="pb-1 cursor-pointer"
            />
            <div className="inline-flex items-center gap-2">
              {showSearch && (
                <Button
                  onClick={handleSearchToggle}
                  variant="ghost"
                  size="icon"
                >
                  <Search size={24} />
                </Button>
              )}
              <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="ghost"
                size="icon"
              >
                <Menu size={24} />
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default MobileNavbar;