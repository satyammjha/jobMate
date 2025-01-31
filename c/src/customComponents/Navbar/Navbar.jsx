"use client";
import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [open, setOpen] = useState(false);

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
        { name: "Referrals", path: "/referrals" },
    ];

    return (
        <nav className="flex justify-between items-center p-4 bg-background border-b">

            <Link to="/" className="text-xl font-bold">
                JobHuntAI
            </Link>

            <div className="hidden md:flex gap-6 dark:text-white">
                {links.map((link) => (
                    <Link
                        key={link.name}
                        to={link.path}
                        className="text-sm font-medium hover:text-primary"
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="flex items-center gap-4">

                <Button variant="outline" size="icon" onClick={toggleTheme}>
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </Button>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

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
                                className="text-lg font-medium hover:text-primary"
                                onClick={() => setOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}
