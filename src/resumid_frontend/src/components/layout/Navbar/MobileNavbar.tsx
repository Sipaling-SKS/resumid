import Logo from "@/assets/logo-black.svg";
import SearchBar from "@/components/parts/SearchBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";
import { cn, scrollToTop, scrollTo } from "@/lib/utils";
import { Menu, X as Close, LogOut, User2 as ProfileIcon } from "lucide-react";
import { NavLink, type NavLinkProps } from "react-router";


function MobileNavbar({ navigate, isOpen, setIsOpen }: any) {
  const { isAuthenticated, login, logout, userData } = useAuth();

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
          <div className="inline-flex gap-6 p-4 border-t border-b border-neutral-200 items-center justify-between">
            <div className="inline-flex gap-2 items-center">
              <div className="bg-primary-500 p-1 rounded-lg h-7 aspect-square text-center text-white font-semibold text-sm">ID</div>
              <p className="text-paragraph font-medium">{String(userData?.ok?.name).split("-").splice(0, 2).join("-")}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="cursor-pointer p-[2px] rounded-full bg-transparent hover:bg-primary-500 transition-colors">
                  <Avatar className="border-2 border-white w-11 h-11">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="text-paragraph m-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
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
        )}
      </div>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed top-0 left-0 w-full h-full z-40" />}
      <div className="relative inline-flex items-center justify-between gap-8 w-full">
        <img onClick={() => navigate("/")} src={Logo} alt="Logo Resumid" className="pb-1" />
        <div className="flex-1 px-2">
          <SearchBar />
        </div>
        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon">
          <Menu size={48} />
        </Button>
      </div>
    </>
  )
}

export default MobileNavbar;