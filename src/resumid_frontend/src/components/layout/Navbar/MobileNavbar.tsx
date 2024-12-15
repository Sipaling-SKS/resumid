import Logo from "@/assets/logo-black.svg";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn, scrollToTop, scrollTo } from "@/lib/utils";
import { Menu, X as Close, LogOut, User2 as ProfileIcon } from "lucide-react";
import { NavLink } from "react-router";

function MobileNavbar({ isAuthenticated, navigate, isOpen, setIsOpen }: any) {
  const handleMenuClick = (callback?: () => void) => {
    if (callback) callback()
    setIsOpen(false)
  }

  return (
    <>
      <div className={cn("fixed flex flex-col h-screen min-w-fit w-1/2 max-w-64 pb-[4vh] z-50 top-0 bottom-0 bg-white border-l border-neutral-200 transition-all duration-500 ease-in-out", isOpen ? "right-0" : "-right-full")}>
        <div className="p-4 h-[73px] inline-flex justify-end w-full border-b border-neutral-200">
          <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="">
            <Close size={48} />
          </Button>
        </div>
        <ul className="flex flex-col items-center justify-center h-full p-4 gap-[4vh] text-lg">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/"
                onClick={() => handleMenuClick(() => {
                  if (window.location.pathname === "/") {
                    scrollToTop()
                  }
                })}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Home
              </NavLink>
              <Button onClick={() => handleMenuClick(() => scrollTo('features', 73))} variant="link" size="lg" className="p-2">
                Features
              </Button>
              <Button onClick={() => handleMenuClick(() => scrollTo('pricing', 73))} variant="link" size="lg" className="p-2">
                Pricing
              </Button>
              <Button onClick={() => handleMenuClick()} variant="gradient" size="lg">
                Sign In
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                onClick={() => handleMenuClick(() => {
                  if (window.location.pathname === "/") {
                    scrollToTop()
                  }
                })}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Home
              </NavLink>
              <NavLink
                to="/"
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                History
              </NavLink>
              <NavLink
                to="/resume-analyzer"
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
              <p className="text-paragraph font-medium">1234567</p>
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
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-500" >
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
        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon">
          <Menu size={48} />
        </Button>
      </div>
    </>
  )
}

export default MobileNavbar;