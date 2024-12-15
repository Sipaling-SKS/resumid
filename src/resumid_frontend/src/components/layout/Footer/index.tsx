import { Facebook, Twitter, Instagram } from "lucide-react";
import LogoWhite from "@/assets/logo-white.svg";

function Footer() {
  return (
    <footer className="bg-primary-500 text-white py-6 px-6 pl-28">
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-center mt-8 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-6 w-full">
          
          {/* Logo dan Deskripsi */}
          <div className="text-center md:text-left md:col-span-3 ">
            <img
              className="pb-2 mx-auto md:mx-0"
              src={LogoWhite}
              alt="Resumid Logo"
            />
            <p className="font-inter text-sm font-light text-white/80 py-2 md:max-w-[350px]">
              Unleash Your Resume’s Potential with AI-Powered <br /> Analysis
            </p>
            <p className="font-inter text-sm font-light text-white/80 pt-10">
              © {new Date().getFullYear()} Resumid. All rights reserved.
            </p>
          </div>

          {/* Menu */}
          <div className="text-center md:text-left py-2">
            <h4 className="font-inter font-semibold text-lg mb-3">Menu</h4>
            <ul className="font-inter text-sm font-light text-white/80 space-y-2">
              <li>
                <a href="/" className="hover:underline ">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:underline">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:underline">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="text-center md:text-left py-2">
            <h4 className="font-inter font-semibold text-lg mb-3">Company</h4>
            <ul className="font-inter text-sm font-light text-white/80 space-y-2">
              <li>
                <a href="/blog" className="hover:underline">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/privacypolicy" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="text-center md:text-left py-2">
            <h4 className="font-inter font-semibold text-lg mb-3">Social</h4>
            <ul className="font-inter text-sm font-light text-white/80 space-y-2">
              <li>
                <a href="/blog" className="hover:underline">
                  Instagram
                </a>
              </li>
              <li>
                <a href="/privacypolicy" className="hover:underline">
                  Facebook
                </a>
              </li>
              <li>
                <a href="/privacypolicy" className="hover:underline">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </footer>
  );
}

export default Footer;
