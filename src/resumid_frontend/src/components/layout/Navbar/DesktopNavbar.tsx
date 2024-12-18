import Logo from "@/assets/logo-black.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, scrollTo, scrollToTop } from "@/lib/utils";
import { NavLink } from "react-router";
import { LogOut, User2 as ProfileIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/AuthContext";


function DesktopNavbar({navigate}: any) {
  const { isAuthenticated, login, logout, loading, principal } = useAuth()

  return (
    <>
      <div className="inline-flex items-center gap-8 md:gap-10 xl:gap-12">
        <img onClick={() => navigate("/")} className="pb-2" src={Logo} alt="Resumid Logo" />
        <ul className="inline-flex items-center gap-4 md:gap-8 xl:gap-10">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    scrollToTop()
                  }
                }}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Home
              </NavLink>
              <Button onClick={() => scrollTo('features', 80)} variant="link" size="lg" className="p-2">
                Features
              </Button>
              <Button onClick={() => scrollTo('pricing', 80)} variant="link" size="lg" className="p-2">
                Pricing
              </Button>
            </>
          ) : (
            <>
              <NavLink
                to="/"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    scrollToTop()
                  }
                }}
                className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
              >
                Home
              </NavLink>
              <NavLink
                to="/history"
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
      </div>
      {isAuthenticated ? (
        <div className="inline-flex gap-6 items-center">
          <div className="inline-flex gap-2 items-center">
            <div className="bg-primary-500 p-1 rounded-lg h-7 aspect-square text-center text-white font-semibold text-sm">ID</div>
            <p className="text-paragraph font-medium">{String(principal)}</p>
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
            <DropdownMenuContent className="text-paragraph">
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
      ) : (
        <Button onClick={login} variant="gradient" size="lg">
          Sign In
        </Button>
      )}
    </>
  )
}

export default DesktopNavbar;