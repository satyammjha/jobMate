"use client";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, User2, Share2, DoorOpen, SparkleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import AuthButtons from "../Navbar/SignInButton";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const location = useLocation();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    const links = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Resume", path: "/reviewresume" },
        { name: "Tracker", path: "/tracker" },

    ];

    return (
        <nav className="flex justify-between items-center p-4 bg-background border-b">
            <Link to="/" className="text-xl font-bold">
                JobHuntAI
            </Link>
            <AuthButtons />
            <div className="hidden md:flex gap-6">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className={`text-sm font-medium hover:text-primary relative ${location.pathname === link.path
                            ? "text-primary after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-primary"
                            : "text-foreground"
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTheme}
                    className="border-l pl-4 rounded-full"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                {!isLoggedIn ? (
                    <div className="hidden md:flex gap-2">
                        <Button asChild variant="default">
                            <Link className="flex items-center gap-2 px-4">
                                Try for Free
                                <SparkleIcon size={16} className="fill-current" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="relative group">
                        <Avatar className="cursor-pointer w-9 h-9">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="absolute right-0 top-11 hidden group-hover:flex flex-col gap-2 bg-background dark:bg-slate-950 p-4 shadow-lg rounded-lg border w-48">
                            <Link
                                to="/profile"
                                className="text-sm px-3 py-2 hover:bg-accent rounded flex items-center gap-3"
                            >
                                <User2 size={16} /> Profile
                            </Link>
                            <Link
                                to="/refer"
                                className="text-sm px-3 py-2 hover:bg-accent rounded flex items-center gap-3"
                            >
                                <Share2 size={16} /> Refer
                            </Link>
                            <button
                                onClick={() => setIsLoggedIn(false)}
                                className="text-sm px-3 py-2 hover:bg-accent rounded flex items-center gap-3 text-left"
                            >
                                <DoorOpen size={16} /> Logout
                            </button>
                        </div>
                    </div>
                )}

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
                            {open ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col gap-4 p-4">
                        {links.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`text-lg font-medium ${location.pathname === link.path
                                    ? "text-primary"
                                    : "text-foreground"
                                    }`}
                                onClick={() => setOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {!isLoggedIn ? (
                            <Button asChild variant="default" className="w-full mt-4">
                                <Link className="flex items-center justify-center gap-2">
                                    Try for Free
                                    <SparkleIcon size={16} className="fill-current" />
                                </Link>
                            </Button>
                        ) : (
                            <>
                                <Link
                                    to="/profile"
                                    className="text-lg font-medium hover:text-primary"
                                    onClick={() => setOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/refer"
                                    className="text-lg font-medium hover:text-primary"
                                    onClick={() => setOpen(false)}
                                >
                                    Refer
                                </Link>
                                <button
                                    className="text-lg font-medium hover:text-primary text-left"
                                    onClick={() => {
                                        setIsLoggedIn(false);
                                        setOpen(false);
                                    }}
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}