import React, { useEffect } from "react";
import Hero from "../Components/Homepage/Hero";
import BuyersChoice from "../Components/Homepage/BuyersChoice";
import FactoryOrderPortfolio from "../Components/Homepage/FactoryOrderPortfolio";
import OurTeam from "../Components/Homepage/OurTeam";
import PhotoGallery from "../Components/Homepage/PhotoGallery";
import ContactUs from "../Components/Homepage/ContactUs";
import ClientsReviews from "../Components/Common/ClientsReviews";
function Home() {
  return (
    <div>
      <Hero />
      <div className="px-5">
        <BuyersChoice title={"Buyers' choice"} />
        <FactoryOrderPortfolio />
        <PhotoGallery />
        <ClientsReviews />
        <OurTeam />
        <ContactUs />
      </div>
    </div>
  );
}

export default Home;
