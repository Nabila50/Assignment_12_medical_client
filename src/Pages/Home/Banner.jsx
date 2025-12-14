import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Banner = () => {
  return (
    <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false}>
      <div>
        <img className="w-100 h-80" src="banner-5.webp" />
 
      </div>
      <div>
        <img className="w-100 h-80" src=" banner-4.avif" />
 
      </div>
      <div>
        <img className="w-100 h-80" src="banner-6.webp" />
 
      </div>
    </Carousel>
  );
};

export default Banner;
