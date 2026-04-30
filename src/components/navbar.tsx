import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface NavbarProps {
  pathname?: string;
}

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Solutions", href: "/solutions" },
  { label: "Products", href: "/products" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Navbar = ({ pathname = "/" }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
  }, [open]);

  const Logo = () => (
    <a href="/" className="flex items-center group z-50">
      <img src="/assets/logo.png" alt="Trackora" fetchPriority="high" className="h-14 lg:h-16 w-auto transform transition-transform duration-500 group-hover:scale-105" />
    </a>
  );

  const menuVariants = {
    closed: { x: "100%", transition: { type: "spring", stiffness: 400, damping: 40 } },
    opened: { x: 0, transition: { type: "spring", stiffness: 400, damping: 40, staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    opened: { opacity: 1, x: 0 }
  };

  return (
    <>
      <header className="w-full px-4 sm:px-6 lg:px-16 py-4 lg:py-6 flex justify-between items-center z-[9998] sticky top-0 bg-[#FAFAFA]/90 backdrop-blur-md border-b border-[#E4E4E7] isolate">
      <Logo />

      {/* DESKTOP NAV */}
      <nav className="hidden lg:flex items-center gap-12">
        {menuItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
          return (
            <a
              key={item.label}
              href={item.href}
              className={`relative text-[13px] font-medium tracking-wide transition-colors group overflow-hidden ${isActive ? "text-[#09090B]" : "text-[#71717A] hover:text-[#09090B]"}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-[#09090B] transform transition-transform duration-300 ease-out ${isActive ? "translate-x-0" : "-translate-x-full group-hover:translate-x-0"}`} />
            </a>
          )
        })}
      </nav>

      <div className="hidden lg:flex items-center gap-2.5">
        <a
          href="/contact"
          onClick={() => (window as any).trackEvent?.("cta_click", { location: "navbar_desktop", target: "/contact" })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#09090B] text-white font-semibold text-[12px] lg:text-[13px] tracking-wide hover:opacity-90 transition-opacity"
        >
          Book Demo <Icon icon="mdi:arrow-top-right" className="w-3 h-3 lg:w-4 lg:h-4" />
        </a>
      </div>

      {/* MOBILE TOGGLE */}
      <div className="lg:hidden flex items-center gap-2">
        <a
          href="/contact"
          onClick={() => (window as any).trackEvent?.("cta_click", { location: "navbar_mobile", target: "/contact" })}
          className="inline-flex items-center justify-center px-3 py-2 rounded-full bg-[#09090B] text-white text-[11px] font-semibold tracking-wide"
        >
          Demo
        </a>
        <button onClick={() => setOpen(true)} className="flex flex-col gap-1.5 p-2 z-50" aria-label="Open menu">
          <span className="w-6 h-[2px] bg-[#09090B]" />
          <span className="w-4 h-[2px] bg-[#09090B] self-end" />
          <span className="w-6 h-[2px] bg-[#09090B]" />
        </button>
      </div>

      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="opened"
              exit="closed"
              className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-[#FAFAFA] z-[10000] flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-5 sm:p-6 lg:p-8 border-b border-gray-100">
                <Logo />
                <button onClick={() => setOpen(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-[#09090B] text-xl">
                  <Icon icon="mdi:close" className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col px-6 sm:px-8 py-8 sm:py-10 gap-1">
                <span className="text-[10px] font-bold text-[#71717A] tracking-[0.2em] mb-4 uppercase">Menu</span>
                {menuItems.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
                  return (
                    <motion.a
                      key={item.label}
                      variants={itemVariants}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`text-[30px] sm:text-3xl font-semibold py-2.5 transition-colors ${isActive ? "text-[#71717A]" : "text-[#09090B] hover:text-[#71717A]"}`}
                    >
                      {item.label}
                    </motion.a>
                  )
                })}
              </div>

              <motion.div variants={itemVariants} className="mt-auto p-6 sm:p-8 bg-white border-t border-gray-100 flex flex-col gap-5">
                <div>
                  <p className="text-sm tracking-wide text-[#71717A] mb-2 font-medium">Have questions?</p>
                  <a href="tel:+917206617045" className="text-xl font-semibold text-[#09090B]">+91 72066 17045</a>
                </div>
                <a
                  href="/contact"
                  onClick={() => {
                    setOpen(false);
                    (window as any).trackEvent?.("cta_click", { location: "menu_mobile", target: "/contact" });
                  }}
                  className="w-full py-4 flex items-center justify-center gap-2 bg-[#09090B] text-white font-semibold tracking-wide transition-opacity hover:opacity-90 rounded-xl"
                >
                  Book Demo <Icon icon="mdi:arrow-right" className="w-4 h-4" />
                </a>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;