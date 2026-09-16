import React from 'react';
import Navbar from './Navbar';

function Layout({ children }) {
  return (
    <div className="bg-[#141414] min-h-screen text-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}

export default Layout;

