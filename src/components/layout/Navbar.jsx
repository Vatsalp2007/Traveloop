import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Avatar from "../common/Avatar";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/trips", label: "My Trips" },
  { to: "/my-budget", label: "Budget" },
  { to: "/community", label: "Community" },
];

export default function Navbar({ onMenuClick }) {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);

  const isDashboard = location.pathname === "/" || location.pathname === "/dashboard";

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 60 && currentScrollY > lastScrollY.current) {
        setShowHeader(false);
      } else if (currentScrollY <= 60 || currentScrollY < lastScrollY.current) {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      console.error("Logout failed");
    }
  };

  const isActive = (path) => {
    if (path === "/dashboard") return location.pathname === "/" || location.pathname === "/dashboard";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 h-20 z-50 transition-all duration-500 ${
      showHeader ? "translate-y-0" : "-translate-y-full"
    } ${
      isDashboard
        ? "bg-transparent backdrop-blur-xl border-b border-white/20"
        : "bg-primary shadow-lg"
    }`}>
      <div className="flex items-center justify-between w-full h-full px-5 md:px-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer text-white"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link
            to="/dashboard"
            className="font-headline-lg text-headline-lg font-bold text-white tracking-tight cursor-pointer no-underline"
          >
            Traveloop
          </Link>
        </div>

        {isDashboard && (
          <>
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-label-md text-label-md no-underline transition-colors duration-200 relative ${
                    isActive(link.to)
                      ? "text-white font-bold after:absolute after:bottom-[-26px] after:left-0 after:w-full after:h-[2px] after:bg-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/trips/new")}
                className="hidden sm:flex items-center gap-2 px-8 py-3 bg-white text-[#00327d] rounded-full font-label-md text-label-md font-bold transition-all hover:shadow-lg hover:shadow-black/20 active:scale-95 cursor-pointer"
              >
                Plan a Trip
              </button>
              <div className="flex items-center gap-3 ml-2 text-white">
                <span className="material-symbols-outlined cursor-pointer hover:text-white/80 transition-colors p-2 rounded-full hover:bg-white/20">
                  notifications
                </span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="cursor-pointer bg-transparent border-none p-1 rounded-full hover:bg-surface-container-high transition-colors"
                  >
                    <Avatar
                      src={userData?.photoURL}
                      name={userData?.name || userData?.email}
                      size="sm"
                    />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-card rounded-xl shadow-lg border border-gray-100 py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-secondary hover:bg-gray-50 no-underline"
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-danger hover:bg-gray-50 cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
