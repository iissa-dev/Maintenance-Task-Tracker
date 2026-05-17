import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  FolderTree,
  LogOut,
  UserCircle,
  ListFilter,
  UserCog,
  Menu,
  X
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard, OnlyAdmin: false },
  { path: "/request", label: "Requests", icon: ClipboardList, OnlyAdmin: false },
  { path: "/UserManagement", label: "Users", icon: Users, OnlyAdmin: true },
  { path: "/serviceManagement", label: "Services", icon: FolderTree, OnlyAdmin: false },
  { path: "/categories", label: "Categories", icon: ListFilter, OnlyAdmin: true },
  { path: "/userProfile", label: "Profile", icon: UserCog, OnlyAdmin: false }
];

function Sidebar() {
  const { pathname } = useLocation();
  const { authToken, logout } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const baseItemClass = `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm mb-2`;
  const activeItemClass = `bg-primary/10 text-main border border-primary/20 shadow-sm`;
  const inactiveItemClass = `text-sub hover:bg-muted/50 hover:text-foreground`;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`md:hidden fixed z-40 p-2 rounded-xl bg-card border border-border shadow-md text-main hover:bg-muted transition-all duration-300
          ${isVisible ? "top-4 left-4 opacity-100" : "-top-16 left-4 opacity-0 pointer-events-none"}
        `}
      >
        <Menu size={24} />
      </button>

      {/* (Overlay) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col justify-between py-8 transition-transform duration-300 transform
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        
        md:sticky md:top-0 md:h-screen md:w-20 lg:w-64 md:translate-x-0 md:flex md:transition-all
      `}>
        <div>
          {/* Brand / Logo Area */}
          <div className="px-6 mb-10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-black">M</span>
              </div>
              <span className="md:hidden lg:inline font-bold text-lg tracking-tight gradient-text">
                System Pro
              </span>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-sub hover:bg-muted transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3">
            <ul className="flex flex-col items-stretch md:items-center lg:items-stretch">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                const canShow = authToken?.role === "Admin" || !item.OnlyAdmin;
                if (!canShow) return null;
                
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`${baseItemClass} ${isActive ? activeItemClass : inactiveItemClass}`}
                    >
                      <Icon
                        size={20}
                        className={
                          isActive
                            ? "text-main"
                            : "text-sub group-hover:text-foreground"
                        }
                      />
                      <span className="md:hidden lg:inline">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        {/* Bottom Section: Logout */}
        <div className="px-3 pt-6 border-t border-border/50">
          {authToken ? (
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/5 transition-all duration-300 font-bold text-sm group"
            >
              <LogOut
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="md:hidden lg:inline">Sign Out</span>
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-main hover:bg-primary/5 transition-all duration-300 font-bold text-sm"
            >
              <UserCircle size={20} />
              <span className="md:hidden lg:inline">Sign In</span>
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;