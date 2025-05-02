import React from "react";
import Footer from "@/_components/Footer";
import ContentHome from "@/_components/ContentHome";
import Header from "@/_components/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <ContentHome />
      <Footer />
    </div>
  );
};
export default Home;
