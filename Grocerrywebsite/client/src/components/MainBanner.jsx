import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../greencart_assets/assets";

const MainBanner = () => {
  return (
    <div className="relative h-[400px] overflow-hidden ">
      {/* Background Video - Removed opacity from video container */}
      <div className="absolute inset-0 z-1 ">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover  "
        >
          <source src={assets.MainBanner} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Overlay Content - Moved bg-opacity to a separate overlay div */}
      <div className="absolute inset-0 z-10 bg-opacity-100 bg-black-50    "></div>

      <div
        className="absolute inset-0 z-20 flex flex-col items-center 
        md:items-start justify-center px-4 md:px-18 lg:px-24 bg-opacity-100"
      >
        <h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-center 
          md:text-left max-w-72 md:max-w-80 lg:max-w-105 leading-tight lg:leading-[1.3]
          text-green-700 drop-shadow-lg"
        >
          Freshness You can Trust, Savings You will Love!
        </h1>

        <div className="flex items-center mt-6 font-medium space-x-4">
          <Link
            to={"/products"}
            className="group flex items-center gap-2 px-7 md:px-9 py-3 
            bg-primary hover:bg-primary-dull transition rounded text-white"
          >
            Shop now
            <svg
              className="transition group-hover:translate-x-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>

          <Link
            to={"/products"}
            className="group hidden md:flex items-center gap-2 px-9 py-3 
            bg-white bg-opacity-90 hover:bg-opacity-100 transition rounded"
          >
            Explore deals
            <svg
              className="transition group-hover:translate-x-1 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;
