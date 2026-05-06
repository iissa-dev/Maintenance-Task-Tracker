import {
    LayoutDashboard,
    ClipboardList,
    Users,
    FolderTree,
    LogOut,
    UserCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const NAV_ITEMS = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/request", label: "Requests", icon: ClipboardList },
    { path: "/UserManagement", label: "Users", icon: Users },
    { path: "/serviceManagement", label: "Services", icon: FolderTree },
];

function Sidebar() {
    const { pathname } = useLocation();
    const { user, logout } = useAuth();

    const baseItemClass = `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm mb-2`;

    const activeItemClass = `bg-primary/10 text-main border border-primary/20 shadow-sm`;
    const inactiveItemClass = `text-sub hover:bg-muted/50 hover:text-foreground`;

    return (
        <aside className="h-screen w-20 md:w-64 bg-card border-r border-border flex flex-col justify-between py-8 transition-all duration-300">
            <div>
                {/* Brand / Logo Area */}
                <div className="px-6 mb-10 flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="text-primary-foreground font-black">M</span>
                    </div>
                    <span className="hidden md:block font-bold text-lg tracking-tight gradient-text">
                        System Pro
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="px-3">
                    <ul className="flex flex-col items-center md:block">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;

                            return (
                                <li key={item.path}>
                                    <Link
                                        to={item.path}
                                        className={`${baseItemClass} ${isActive ? activeItemClass : inactiveItemClass}`}
                                    >
                                        <Icon size={20} className={isActive ? "text-main" : "text-sub group-hover:text-foreground"} />
                                        <span className="hidden md:inline">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>

            {/* Bottom Section: Profile & Logout */}
            <div className="px-3 pt-6 border-t border-border/50">
                {user ? (
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-danger hover:bg-danger/5 transition-all duration-300 font-bold text-sm group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden md:inline">Sign Out</span>
                    </button>
                ) : (
                    <Link
                        to="/login"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-main hover:bg-primary/5 transition-all duration-300 font-bold text-sm"
                    >
                        <UserCircle size={20} />
                        <span className="hidden md:inline">Sign In</span>
                    </Link>
                )}
            </div>
        </aside>
    );
}

export default Sidebar;