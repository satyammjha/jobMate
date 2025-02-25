"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Sparkles, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    useUser,
    UserButton,
} from "@clerk/clerk-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import RefferalButton from "../Refferal/RefferalButton";
import useUserData from "../../Context/UserContext";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [open, setOpen] = useState(false);
    const [credits, setCredits] = useState(null);
    const [isLoadingCredits, setIsLoadingCredits] = useState(false);
    const location = useLocation();
    const params = useParams();
    const { user, isSignedIn } = useUser();
    const { fetchUserData } = useUserData();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        let referral = params.referralCode;
        console.log("Referral code1:", referral);
        if (!referral) {
            const pathParts = location.pathname.split("/");
            if (pathParts[1] === "ref" && pathParts[2]) {
                referral = pathParts[2];
            }
        }
        if (referral) {
            localStorage.setItem("referral", referral);
            console.log("Referral code3:", referral);

        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const refQuery = urlParams.get("ref");
            if (refQuery) {
                localStorage.setItem("referral", refQuery);
                urlParams.delete("ref");
                window.history.replaceState(
                    {},
                    "",
                    `${window.location.pathname}?${urlParams.toString()}`
                );
            }
            console.log("Referral code2:", referral);
        }
    }, [params, location.pathname]);
    useEffect(() => {
        let isMounted = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const handleAuthFlow = async () => {
            if (!isSignedIn || !user) {
                localStorage.removeItem("user");
                localStorage.removeItem("jobDescription");
                localStorage.removeItem("currentPdf");
                localStorage.removeItem("coverLetters");
                localStorage.removeItem("resSignIn");
                return;
            }

            try {
                const email =
                    user.primaryEmailAddress?.emailAddress ||
                    user.emailAddresses?.[0]?.emailAddress;
                if (!email || !emailRegex.test(email)) {
                    console.error("Invalid email format");
                    return;
                }
                await fetchUserData(email);
                const currentUserData = JSON.parse(localStorage.getItem("user"));
                if (!currentUserData) {

                    const referredBy = localStorage.getItem("referral");
                    console.log("Referred by:", referredBy);
                    const response = await axios.post("http://localhost:5000/user", {
                        name: user.fullName,
                        email,
                        referredBy: referredBy || null,
                    });

                    if (isMounted) {
                        localStorage.setItem("user", JSON.stringify(response.data.user));
                        localStorage.removeItem("referral");
                        fetchUserData(email);
                    }
                }
            } catch (error) {
                console.error("Auth error:", error);
                if (error.response?.status === 409) {

                    const email =
                        user.primaryEmailAddress?.emailAddress ||
                        user.emailAddresses?.[0]?.emailAddress;
                    fetchUserData(email);
                }
            }
        };

        handleAuthFlow();

        return () => {
            isMounted = false;
        };
    }, [isSignedIn, user, fetchUserData]);

    const toggleTheme = () =>
        setTheme(theme === "light" ? "dark" : "light");

    const links = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard", protected: true },
        { name: "Resume", path: "/reviewresume" },
        { name: "Tracker", path: "/tracker" },
        { name: "Referrals", path: "/refferals" },
    ];

    return (
        <>

            <nav className="flex justify-between items-center px-4 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">

                <Link to="/" className="flex items-center gap-2 group">
                    <Sparkles
                        size={24}
                        className="text-primary transition-transform group-hover:rotate-12"
                    />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                        JobHuntAI
                    </span>
                </Link>

                <div className="hidden md:flex gap-8 items-center">
                    <SignedIn>
                        {links.map(
                            (link) =>
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
                        )}
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

                <div className="flex items-center gap-3">
                    <SignedIn>
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
                                    `AICredits: 170`
                                )}
                            </span>
                        </Button>
                        <RefferalButton />
                    </SignedIn>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-accent text-foreground/80 hover:text-foreground transition-transform hover:scale-105"
                        aria-label="Toggle Theme"
                        onClick={() => {
                            toggleTheme();

                        }}

                    >
                        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                    </Button>

                    <SignedIn>
                        <UserButton
                            afterSignOutUrl="/"
                            appearance={{
                                elements: {
                                    avatarBox:
                                        "w-9 h-9 border-2 border-primary/20 hover:border-primary/40 transition-colors",
                                },
                            }}
                        />
                    </SignedIn>

                    <SignedOut>
                        <SignInButton mode="modal" aftersigninurl="/">
                            <Button
                                variant="default"
                                className="gap-2 px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white transition-all shadow-lg hover:shadow-xl"
                                aria-label="Get Started"
                            >
                                Get Started
                                <Sparkles size={16} />
                            </Button>
                        </SignInButton>
                    </SignedOut>

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
                        <SheetContent
                            side="left"
                            className="flex flex-col gap-4 p-6 w-[280px]"
                        >
                            <div className="flex flex-col gap-2">
                                <SignedIn>
                                    {links.map(
                                        (link) =>
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
                                    )}
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

                            <SignedIn>
                                <div className="mt-4 pt-4 border-t sm:hidden md:hidden">
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
        </>
    );
}
