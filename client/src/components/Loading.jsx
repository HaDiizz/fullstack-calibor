import React from "react";
import icon from "../assets/favicon.ico";

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="loading">
            <div className="dark">
              <img src={icon} />
            </div>
            <div className="dark">
              <img src={icon} />
            </div>
          </div>
          <span className="text-lg font-bold text-gray-100">Loading...</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
