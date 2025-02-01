import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const Marquee = () => {
    const marqueeRef = useRef(null);

    useEffect(() => {
        const marqueeWidth = marqueeRef.current.scrollWidth;
        gsap.fromTo(
            marqueeRef.current,
            { x: "0%" }, // Start from right
            {
                x: `-100%`, // Move to left until the text is out of the screen
                duration: 100, // Very slow speed
                repeat: -1,
                ease: "linear",
            }
        );
    }, []);

    return (
        <div className="w-full overflow-hidden bg-black py-4 flex items-center">
            <div
                ref={marqueeRef}
                className="text-gray-400 text-[4rem] font-bold whitespace-nowrap flex gap-8"
            >
                <span>Innovative </span>
                <span>-</span>
                <span>Personalized </span>
                <span>-</span>
                <span>Real Time </span>
                <span>-</span>
                <span>Innovative </span>
                <span>-</span>
                <span>Personalized </span>
                <span>-</span>
                <span>Real Time </span>
                <span>-</span>
                <span>Innovative </span>
                <span>-</span>
                <span>Personalized </span>
                <span>-</span>
                <span>Real Time </span>
                <span>-</span>
                <span>Innovative </span>
                <span>-</span>
                <span>Personalized </span>
                <span>-</span>
                <span>Real Time </span>
                <span>-</span>
                <span>Innovative </span>
                <span>-</span>
                <span>Personalized </span>
                <span>-</span>
                <span>Real Time </span>
                <span>-</span>
                <span>Innovative </span>
                <span>-</span>
                <span>Personalized </span>
                <span>-</span>
                <span>Real Time </span>
                <span>-</span>
                <span>Innovative </span>
                <span>-</span>
                <span>Personalized </span>
                <span>-</span>
                <span>Real Time </span>
                <span>-</span>
            </div>
        </div>
    );
};

export default Marquee;
