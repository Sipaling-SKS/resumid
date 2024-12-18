import { useState } from "react";
import DesktopNavbar from "@/components/layout/Navbar/DesktopNavbar";
import MobileNavbar from "@/components/layout/Navbar/MobileNavbar";
import useWindowSize from "@/hooks/useMediaQuery";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/AuthContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isMobile } = useWindowSize()

  const navigate = useNavigate()
  const Nav = isMobile ? MobileNavbar : DesktopNavbar;

  return (
    <nav className="sticky top-0 z-30 inline-flex items-center justify-between w-full px-[4%] xl:px-[8%] py-4 border-b border-neutral-200 bg-white">
      <Nav navigate={navigate} isOpen={isOpen} setIsOpen={setIsOpen} />
    </nav>
  )
}

export default Navbar;