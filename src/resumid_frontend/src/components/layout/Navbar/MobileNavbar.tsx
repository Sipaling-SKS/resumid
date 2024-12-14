import Logo from "@/assets/logo-black.svg";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn, scrollToTop, scrollTo } from "@/lib/utils";
import { Menu, X as Close } from "lucide-react";
import { NavLink } from "react-router";

function MobileNavbar({ isAuthenticated, navigate, isOpen, setIsOpen }: any) {
  const handleMenuClick = (callback?: () => void) => {
    if (callback) callback()
    setIsOpen(false)
  }

  return (
    <>
      <div className={cn("fixed h-screen min-w-fit w-1/2 max-w-64 p-4 z-50 top-0 bottom-0 bg-white border-l border-neutral-200 transition-all duration-500 ease-in-out", isOpen ? "right-0" : "-right-full")}>
        <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="absolute top-4 right-4">
          <Close size={48} />
        </Button>
        <ul className="flex flex-col items-center justify-center h-full gap-[4vh] pb-[4vh] text-lg">
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
              className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
            >
              History
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) => cn(buttonVariants({ variant: "link", size: "lg" }), "p-2", isActive && "underline")}
            >
              Resume Analyzer
            </NavLink>
          </>
        )}
        </ul>
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