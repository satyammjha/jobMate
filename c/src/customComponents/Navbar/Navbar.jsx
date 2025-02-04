"use client";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, User, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from "@clerk/clerk-react";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { user } = useUser();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    const links = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard", protected: true },
        { name: "Resume", path: "/reviewresume" },
        { name: "Tracker", path: "/tracker" },
    ];

    return (
        <nav className="flex justify-between items-center p-4 bg-background border-b sticky top-0 z-50">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                JobHuntAI
            </Link>

            <div className="hidden md:flex gap-6 items-center">
                {links.map((link) => (
                    <SignedIn key={link.name}>
                        {(!link.protected || user) && (
                            <Link
                                to={link.path}
                                className={`text-sm font-medium hover:text-primary transition-colors relative ${location.pathname === link.path
                                    ? "text-primary after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-[2px] after:bg-primary"
                                    : "text-foreground/80"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )}
                    </SignedIn>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full hover:bg-accent"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                <SignedIn>
                    <div className="relative group">
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9",
                                },
                            }}
                        />
                    </div>
                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal">
                        <Button variant="default" className="gap-2 hidden md:flex">
                            Get Started
                            <Sparkles size={16} />
                        </Button>
                    </SignInButton>
                </SignedOut>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="md:hidden">
                            {open ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col gap-4 p-6">
                        <div className="flex flex-col gap-6">
                            {links.map((link) => (
                                <SignedIn key={link.name}>
                                    {(!link.protected || user) && (
                                        <Link
                                            to={link.path}
                                            className={`text-lg font-medium ${location.pathname === link.path
                                                ? "text-primary"
                                                : "text-foreground"
                                                }`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </SignedIn>
                            ))}

                            <SignedIn>
                                <div className="flex flex-col gap-4 mt-4 border-t pt-4">
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
                                    <SignOutButton>
                                        <button className="text-lg font-medium hover:text-primary text-left w-full">
                                            Logout
                                        </button>
                                    </SignOutButton>
                                </div>
                            </SignedIn>

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <Button variant="default" className="w-full mt-4 gap-2">
                                        Get Started
                                        <Sparkles size={16} />
                                    </Button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}