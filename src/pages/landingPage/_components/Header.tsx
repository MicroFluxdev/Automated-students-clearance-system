import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Prevent background scroll when menu open (mobile UX best-practice)
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
    { name: "Download", href: "#download" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-soft transition-all duration-300 lg:px-30">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Responsive sizing */}
            <div className="flex items-center gap-2 min-w-fit">
              <div className="p-2 bg-blue-500 rounded-lg shadow-soft flex items-center justify-center">
                <img
                  className="h-8 w-8 sm:h-8 sm:w-8 md:h-8 md:w-8 rounded-md object-cover"
                  src="/MICRO FLUX LOGO.png"
                  alt="App logo"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-foreground select-none">
                ASCS
              </span>
            </div>
            {/* Desktop/Tablet Nav */}
            <nav className="hidden md:flex items-center gap-4 xl:gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="relative text-muted-foreground hover:text-primary transition-colors font-medium px-1 py-1 
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 
                    group"
                  tabIndex={0}
                  aria-label={link.name}
                >
                  {link.name}
                  <span
                    className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"
                    aria-hidden="true"
                  ></span>
                </a>
              ))}
            </nav>
            {/* Desktop/Tablet CTA */}
            <div className="hidden md:flex items-center gap-2 sm:gap-4">
              <Link to="/login" tabIndex={0} aria-label="Login portal">
                <Button className="font-medium shadow-soft hover:shadow-glow transition focus-visible:ring-2 focus-visible:ring-blue-400">
                  Login
                </Button>
              </Link>
            </div>
            {/* Mobile Hamburger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  aria-label="Open menu"
                >
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[70vw] max-w-sm sm:w-[300px] focus:outline-none"
              >
                <div className="flex flex-col h-full m-0 px-2 py-4 sm:p-5">
                  {/* Mobile Header/Brand */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-blue-500 rounded-lg shadow-soft flex items-center justify-center">
                      <img
                        className="h-8 w-8 rounded-md object-cover"
                        src="/MICRO FLUX LOGO.png"
                        alt="App logo"
                      />
                    </div>
                    <SheetTitle className="text-xl font-bold text-foreground">
                      ASCS
                    </SheetTitle>
                  </div>
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-1 sm:gap-2 pb-2 flex-1 w-full">
                    {navLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block text-foreground hover:text-primary font-medium px-4 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 hover:bg-muted transition"
                        onClick={() => setIsMenuOpen(false)}
                        tabIndex={0}
                        aria-label={link.name}
                      >
                        {link.name}
                      </a>
                    ))}
                  </nav>
                  {/* Mobile CTA */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-border w-full">
                    <Link to="/login" tabIndex={0} aria-label="Login portal">
                      <Button className="font-medium shadow-soft hover:shadow-glow w-full transition focus-visible:ring-2 focus-visible:ring-blue-400">
                        Login Portal
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* MOBILE: Add viewport gap to avoid header overlap */}
      <div className="block md:hidden h-16 w-full" aria-hidden="true"></div>
    </motion.div>
  );
};

export default Header;
