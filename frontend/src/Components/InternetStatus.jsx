import React, { useState, useEffect } from "react";

const InternetStatus = () => {
  const [speed, setSpeed] = useState(null);
  const [connectionType, setConnectionType] = useState(null);
  const [signalStrength, setSignalStrength] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Checking...");

  const dummyFileUrl = "https://dummyimage.com/50x50/000/fff.png"; // 🔥 very small 10-15 KB image

  useEffect(() => {
    const measureSpeed = async () => {
      const startTime = performance.now();
      try {
        await fetch(`${dummyFileUrl}?cache_buster=${startTime}`, { cache: "no-store" });
        const endTime = performance.now();
        const duration = (endTime - startTime) / 1000; // in seconds

        // 0.015 MB = 15 KB file roughly
        const fileSizeInMB = 0.015;
        const speedMbps = (fileSizeInMB * 8) / duration;

        setSpeed(speedMbps.toFixed(2));

        if (speedMbps >= 20) {
          setSignalStrength(5);
          setStatusMessage("Excellent");
        } else if (speedMbps >= 10) {
          setSignalStrength(4);
          setStatusMessage("Good");
        } else if (speedMbps >= 5) {
          setSignalStrength(3);
          setStatusMessage("Average");
        } else if (speedMbps >= 2) {
          setSignalStrength(2);
          setStatusMessage("Poor");
        } else {
          setSignalStrength(1);
          setStatusMessage("Very Poor");
        }

      } catch (error) {
        console.error("Speed test failed:", error);
        setStatusMessage("Error Checking");
      }
    };

    measureSpeed();
    const interval = setInterval(measureSpeed, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ('connection' in navigator) {
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      setConnectionType(connection.effectiveType);
    }
  }, []);

  const getColor = () => {
    if (signalStrength >= 4) return "limegreen";
    if (signalStrength === 3) return "orange";
    return "red";
  };

  return (
    <div className="flex flex-col md:flex-row items-center w-[125px] md:w-[150px] gap-2 p-2 rounded-lg shadow-md bg-indigo-50 w-full max-w-xs dark:bg-gray-700">
      {/* Bars */}
      <div className="flex items-end justify-center gap-1">
        {[1,2,3,4,5].map((bar) => (
          <div
            key={bar}
            style={{
              width: "5px",
              height: `${bar * 7}px`,
              backgroundColor: bar <= signalStrength ? getColor() : "#ccc",
              borderRadius: "2px",
              transition: "height 0.3s, background-color 0.3s"
            }}
          ></div>
        ))}
      </div>

      {/* Text Info */}
      <div className="text-center md:text-left text-xs leading-tight">
        <div className="font-semibold text-indigo-600 dark:text-white">{statusMessage}</div>
        {speed && (
          <div className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">{speed}</span> Mbps
          </div>
        )}
        {connectionType && (
          <div className="text-gray-500  dark:text-gray-300 uppercase">{connectionType}</div>
        )}
      </div>
    </div>
  );
};

export default InternetStatus;
