import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const TESLA_LOGO = "/images/tesla-logo.png";

const navLinks = [
  { label: "Giveaway", href: "#giveaway" },
  { label: "Info", href: "#info" },
  { label: "Instruction", href: "#instruction" },
  { label: "Participate", href: "#participate" },
  { label: "Transactions", href: "#transactions" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={TESLA_LOGO} alt="Tesla Logo" className="w-12 h-10 object-contain" />
            <div className="text-2xl font-black">
              <span className="text-red-600">Tesla</span>
              <span className="text-gray-900"> Motors</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <a key={index} href={link.href} className="text-gray-700 hover:text-red-600 font-medium text-sm transition-colors">
                {link.label}
              </a>
            ))}
            <Link to="/Participate">
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6">
                Claim Now
              </Button>
            </Link>
          </div>

          <button className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
            {navLinks.map((link, index) => (
              <a key={index} href={link.href} className="block text-gray-700 hover:text-red-600 font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <Link to="/Participate" onClick={() => setIsMobileMenuOpen(false)}>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">Claim Now</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}