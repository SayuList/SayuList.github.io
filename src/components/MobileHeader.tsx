"use client";

import Link from "next/link";

interface MobileHeaderProps {
    onMenuClick: () => void;
}

export default function MobileHeader({ onMenuClick }: MobileHeaderProps) {
    return (
        <header className="mobile-header">
            <button onClick={onMenuClick} className="hamburger-button" aria-label="メニューを開く">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
            <h1 className="mobile-header-title">
                <Link href="/">SayuList</Link>
            </h1>
        </header>
    );
}
