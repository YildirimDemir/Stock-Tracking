"use client";
import { useSession } from 'next-auth/react';
import { useQuery } from "@tanstack/react-query";
import { requestUser, userLogout } from "@/services/apiUsers";
import Link from "next/link";
import { useState } from "react";
import Style from "./navbar.module.css";

interface User {
    name: string;
    email: string;
}

export default function Navbar() {
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);

    const { isLoading, data: user, error } = useQuery<User>({
        queryKey: ["request-user", session?.user?.email],
        queryFn: async () => {
            if (session?.user?.email) {
                return await requestUser(session.user.email);
            }
        },
        initialData: { name: '', email: '' },
        enabled: !!session?.user?.email,
    });

    async function logoutHandler() {
        await userLogout();
        setMenuOpen(false); // Menü kapansın
    }

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    return (
        <header className={Style.navbar}>
            <Link href='/' className={Style.logo}>{'<ST/>'}</Link>
            <div className={Style.hamburger} onClick={toggleMenu}>
                <div className={menuOpen ? `${Style.change} ${Style.line1}` : Style.line1}></div>
                <div className={menuOpen ? `${Style.change} ${Style.line2}` : Style.line2}></div>
                <div className={menuOpen ? `${Style.change} ${Style.line3}` : Style.line3}></div>
            </div>
            <nav className={`${Style.navigations} ${menuOpen ? Style.active : ''}`}>
                {session ? (
                    <>
                        <Link href="/stocks" onClick={closeMenu}>Stocks</Link>
                        <span>|</span>
                        <Link href="/profile" onClick={closeMenu}>Profile</Link>
                        <span>|</span>
                        <button onClick={logoutHandler} className={Style.logout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href='/login' onClick={closeMenu}>Login</Link>
                        <Link href='/register' onClick={closeMenu}>Register</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
