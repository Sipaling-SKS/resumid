import Logo from "@/assets/logo-black.svg";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  return (
    <nav className="">
      <div>
        <img src={Logo} alt="Resumid Logo" />
        {isAuthenticated ? <ul>
          <Button asChild variant="link">
            <li>Home</li>
          </Button>
          <Button asChild variant="link">
            <li>Features</li>
          </Button>
          <Button asChild variant="link">
            <li>Pricing</li>
          </Button>
          <Button asChild variant="link">
            <li>FAQ</li>
          </Button>
        </ul> : <ul>
        <Button asChild variant="link">
            <li>History</li>
          </Button>
          <Button asChild variant="link">
            <li>Resume Analyzer</li>
          </Button>
        </ul>}
      </div>
    </nav>
  )
}

export default Navbar;