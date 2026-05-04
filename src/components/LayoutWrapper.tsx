"use client";

import React, { useState, useCallback } from 'react';
import MobileHeader from './MobileHeader';
import Sidebar from './Sidebar';

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <MobileHeader onMenuClick={toggleMenu} />
      <div className={`main-layout ${isMenuOpen ? 'menu-open' : ''}`}>
        <Sidebar onLinkClick={toggleMenu} />
        {children}
      </div>
    </>
  );
}
