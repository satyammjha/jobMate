"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Sparkles, User, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, useUser, UserButton } from "@clerk/clerk-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import RefferalButton from "../Refferal/RefferalButton";
import useUserData from "../../Context/UserContext";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [open, setOpen] = useState(false);
    const [credits, setCredits] = useState(null);
    const [isLoadingCredits, setIsLoadingCredits] = useState(true);
    const location = useLocation();
    const { user, isSignedIn } = useUser();
    const { userData, fetchUserData, loading } = useUserData()


    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {

        if (isSignedIn && !loading && !userData) {
            const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress;
            if (email) {
                fetchUserData(email).catch((error) => {
                    console.error("❌ Error fetching user data:", error);
                });
            }
        }
    }, [user, isSignedIn]);
    useEffect(() => {
        const handleSignIn = async () => {
            if (!isSignedIn || !user) return;

            console.log("🔍 User signed in. Checking details...");
            const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || null;
            if (!email) {
                console.error("❌ No email found for the user. Skipping signup.");
                return;
            }

            console.log(`📧 User email: ${email}`);
            if (!email.endsWith("@gmail.com")) {
                console.warn("⚠️ User is not using a Gmail account. Skipping signup.");
                return;
            }

            console.log("✅ User is using Gmail. Proceeding with signup...");
            const resSignIn = localStorage.getItem("resSignIn");
            if (resSignIn === "true") {
                console.log("🟢 User already saved in the database. Skipping signup.");
                return;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const referredBy = urlParams.get("ref") || localStorage.getItem("referral");

            const userData = {
                name: user.fullName,
                email,
                referredBy: referredBy || null,
            };

            console.log("📡 Sending user data to the database:", userData);
            try {
                const response = await axios.post("http://localhost:5000/user", userData);
                console.log("✅ User successfully saved to the database:", response.data);
                localStorage.setItem("resSignIn", "true");
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.removeItem("referral");
            } catch (error) {
                console.error("❌ Error saving user to the database:", error.response?.data || error.message);
            }
        };

        handleSignIn();
    }, []);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    const links = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard", protected: true },
        { name: "Resume", path: "/reviewresume" },
        { name: "Tracker", path: "/tracker" },
        { name: "Referrals", path: "/referrals" },
    ];

    return (
        <nav className="flex justify-between items-center px-4 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
                <Sparkles size={24} className="text-primary transition-transform group-hover:rotate-12" />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                    JobHuntAI
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8 items-center">
                <SignedIn>
                    {links.map((link) => (
                        (!link.protected || user) && (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all hover:scale-105 ${location.pathname === link.path
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-foreground/90 hover:bg-accent hover:text-foreground"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        )
                    ))}
                </SignedIn>

                <SignedOut>
                    {links
                        .filter((link) => !link.protected)
                        .map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-all hover:scale-105 ${location.pathname === link.path
                                    ? "bg-primary/10 text-primary font-semibold"
                                    : "text-foreground/90 hover:bg-accent"
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                </SignedOut>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
                <SignedIn>
                    {/* AICredit Button */}
                    <Button
                        variant="outline"
                        className="gap-2 hidden md:flex hover:bg-primary/10 hover:scale-105 transition-transform"
                        aria-label="AI Credits"
                    >
                        <Trophy size={16} className="text-primary" />
                        <span className="text-sm font-medium">
                            {isLoadingCredits ? (
                                <Skeleton className="h-4 w-20" />
                            ) : (
                                `AICredits: ${credits}`
                            )}
                        </span>
                    </Button>

                    {/* Referral Button */}
                    <RefferalButton />
                </SignedIn>

                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleTheme}
                    className="rounded-full hover:bg-accent text-foreground/80 hover:text-foreground transition-transform hover:scale-105"
                    aria-label="Toggle Theme"
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                {/* User Button */}
                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9 border-2 border-primary/20 hover:border-primary/40 transition-colors",
                            },
                        }}
                    />
                </SignedIn>

                {/* Sign In Button */}
                <SignedOut>
                    <SignInButton mode="modal" afterSignInUrl="/">
                        <Button
                            variant="default"
                            className="gap-2 hidden md:flex hover:scale-105 transition-transform"
                            aria-label="Get Started"
                        >
                            Get Started
                            <Sparkles size={16} />
                        </Button>
                    </SignInButton>
                </SignedOut>

                {/* Mobile Menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="md:hidden hover:scale-105 transition-transform"
                            aria-label="Open Menu"
                        >
                            {open ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col gap-4 p-6 w-[280px]">
                        <div className="flex flex-col gap-2">
                            <SignedIn>
                                {links.map((link) => (
                                    (!link.protected || user) && (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`px-4 py-3 rounded-lg text-base font-medium transition-all hover:scale-105 ${location.pathname === link.path
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-foreground/90 hover:bg-accent"
                                                }`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    )
                                ))}
                            </SignedIn>

                            <SignedOut>
                                {links
                                    .filter((link) => !link.protected)
                                    .map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`px-4 py-3 rounded-lg text-base font-medium transition-all hover:scale-105 ${location.pathname === link.path
                                                ? "bg-primary/10 text-primary font-semibold"
                                                : "text-foreground/90 hover:bg-accent"
                                                }`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                            </SignedOut>
                        </div>

                        {/* Mobile Refer Button */}
                        <SignedIn>
                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2 hover:scale-105 transition-transform"
                                    onClick={() => setOpen(false)}
                                >
                                    <Gift size={16} />
                                    Refer & Earn
                                </Button>
                            </div>
                        </SignedIn>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}