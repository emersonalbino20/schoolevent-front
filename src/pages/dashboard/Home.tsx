import React, { useState } from "react";
import Footer from "@/_components/Footer";
import ContentHome from "@/_components/ContentHome";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Content */}
      <ContentHome />
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
