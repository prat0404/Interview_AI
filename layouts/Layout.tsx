// components/Layout.jsx
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React from "react";

function Layout({   children, style, className }: any) {
  return (
    <div className={`flex flex-col min-h-screen ${className}`} style={{ ...style, backgroundColor: 'white' }}>
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Layout;
