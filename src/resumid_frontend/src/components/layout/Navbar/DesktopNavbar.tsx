import Logo from "@/assets/logo-black.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, scrollTo, scrollToTop } from "@/lib/utils";
import { NavLink } from "react-router";
import { LogIn, LogOut, User2 as ProfileIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/contexts/AuthContext";
import { useData } from "@/contexts/DataContext";

function DesktopNavbar({ navigate }: any) {
  const { isAuthenticated, login, logout, userData } = useAuth();

  return (
    <>
      <div className="inline-flex items-center gap-8 md:gap-10 xl:gap-12">
        <img
          onClick={() => navigate("/")}
          className="pb-1 cursor-pointer"
          src={Logo}
          alt="Resumid Logo"
        />
        <ul className="inline-flex items-center gap-4 md:gap-8 xl:gap-10">
          {!isAuthenticated ? (
            <>
              <NavLink
                to="/"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    scrollToTop();
                  }
                }}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "link", size: "lg" }),
                    "p-0",
                    isActive && "underline"
                  )
                }
              >
                Home
              </NavLink>
              <Button
                onClick={() => scrollTo("features", 72)}
                variant="link"
                size="lg"
                className="p-0"
              >
                Features
              </Button>
              <Button
                onClick={() => scrollTo("pricing", 72)}
                variant="link"
                size="lg"
                className="p-0"
              >
                Pricing
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
                }}
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "link", size: "lg" }),
                    "p-0",
                    isActive && "underline"
                  )
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/"
                onClick={() => {
                  if (window.location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => scrollTo("pricing", 72), 50); // wait for render
                  } else {
                    scrollTo("pricing", 72);
                  }
                }}

                className={cn(
                  buttonVariants({ variant: "link", size: "lg" }),
                  "p-0"
                )}
              >
                Pricing
              </NavLink>
              <NavLink
                to="/result"
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "link", size: "lg" }),
                    "p-0",
                    isActive && "underline"
                  )
                }
              >
                Results
              </NavLink>
              <NavLink
                to="/resume-analyzer"
                className={({ isActive }) =>
                  cn(
                    buttonVariants({ variant: "link", size: "lg" }),
                    "p-0",
                    isActive && "underline"
                  )
                }
              >
                Resume Analyzer
              </NavLink>
            </>
          )}
        </ul>
      </div>
      {isAuthenticated ? (
        <div className="inline-flex gap-4 items-center">
          <div className="inline-flex gap-2 items-center">
            <div className="bg-primary-500 p-1 rounded-lg h-7 aspect-square text-center text-white font-semibold text-sm">
              ID
            </div>
            <p className="text-paragraph font-medium">
              {String(userData?.ok?.name).split("-").splice(0, 2).join("-")}
            </p>
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
              <DropdownMenuItem className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-500" onClick={logout}>
                <LogOut />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button variant="gradient" onClick={() => login()}>
          Sign In
          <LogIn strokeWidth={2.8} />
        </Button>
      )}
    </>
  );
}

export default DesktopNavbar;
