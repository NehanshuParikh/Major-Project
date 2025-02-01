  import React, { useEffect, useRef, useState } from 'react';
  import { useNavigate } from 'react-router';
  import { Canvas } from '@react-three/fiber';
  import { OrbitControls, Environment, ScrollControls } from '@react-three/drei';
  import { motion, AnimatePresence } from "framer-motion";
  import LaptopContainer from '../Components/Client/LaptopContainer';
  import { GiHamburgerMenu } from 'react-icons/gi'; // Hamburger Menu icon
  import { MdClose } from 'react-icons/md'; // Close icon

  import RotatingCylinder from '../Components/Client/RotatingCylinder';
  import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'
  import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing'
  import Marquee from '../Components/Client/Marquee';


  import LocomotiveScroll from 'locomotive-scroll'; // Import Locomotive Scroll
  import 'locomotive-scroll/dist/locomotive-scroll.css'; // Import styles
  import FAQSection from '../Components/Client/FAQSection';
  import Footer from '../Components/Client/Footer';
  import FeatureSection from '../Components/Client/FeatureSection';


  const HomePage = () => {
    const navigate = useNavigate();
    const [enableOrbit, setEnableOrbit] = useState(window.innerWidth > 1024);
    const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const messages = [
      "Loading assets...",
      "Setting things up...",
      "Optimizing experience...",
      "Almost there...",
      "Finalizing..."
    ];

    const [messageIndex, setMessageIndex] = useState(0);


    useEffect(() => {
      let interval;
    
      const handleLoad = () => {
        let progressValue = 0;
        interval = setInterval(() => {
          progressValue += Math.random() * 15; // Increase dynamically
    
          // Update the message based on progress
          if (progressValue >= 100) {
            progressValue = 100;
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 1000);
          }
    
          // Update message index based on progress milestones
          if (progressValue >= 0 && progressValue < 20) {
            setMessageIndex(0);
          } else if (progressValue >= 20 && progressValue < 40) {
            setMessageIndex(1);
          } else if (progressValue >= 40 && progressValue < 60) {
            setMessageIndex(2);
          } else if (progressValue >= 60 && progressValue < 80) {
            setMessageIndex(3);
          } else if (progressValue >= 80 && progressValue < 100) {
            setMessageIndex(4);
          }
    
          setProgress(Math.floor(progressValue));
        }, 500);
      };
    
      if (document.readyState === "complete") {
        handleLoad();
      } else {
        window.addEventListener("load", handleLoad);
        return () => window.removeEventListener("load", handleLoad);
      }
    }, []);



    // Handle resize
    useEffect(() => {
      const handleResize = () => {
        setEnableOrbit(window.innerWidth > 1024); // Enable OrbitControls only on large screens
        setWindowWidth(window.innerWidth); // Update window width
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleSignupRequest = () => {
      navigate('/api/auth/signup');
    };

    const handleLoginRequest = () => {
      navigate('/api/auth/login');
    };

    return (
      <>
        <div className="relative">

          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="fixed top-0 left-0 w-full h-screen flex flex-col justify-center items-center bg-white text-black z-50"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
              >
                <motion.div
                  className="text-3xl font-bold mb-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  Loading {progress}%
                </motion.div>

                {/* Changing Text Below the Counter */}
                <motion.div
                  key={messageIndex} // Forces reanimation when text changes
                  className="text-lg font-medium my-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {messages[messageIndex]}
                </motion.div>

                <motion.div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin" />
              </motion.div>
            )}
          </AnimatePresence>
          {/* CTA Section */}
          <div className="CTA bg-black py-4 absolute z-10 top-0 left-0 right-0 flex justify-center items-center gap-6 sm:gap-8">

            {/* Buttons */}
            <div className="flex justify-center items-center gap-4">
              <span className="text-xs md:text-lg text-gray-300">Get Started Today!</span>
              <button
                onClick={handleLoginRequest}
                className="cta-button px-4 py-2 text-md font-semibold bg-transparent border-1 border-cyan-200 text-white rounded-lg shadow-lg transition-all transform hover:bg-white hover:text-black hover:border-transparent focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-95"
              >
                Login
              </button>
              <button
                onClick={handleSignupRequest}
                className="cta-button px-4 py-2 text-md font-semibold bg-transparent border-1 border-cyan-200 text-white rounded-lg shadow-lg transition-all transform hover:bg-white hover:text-black hover:border-transparent focus:outline-none focus:ring-4 focus:ring-green-300 active:scale-95"
              >
                Signup
              </button>
            </div>
          </div>



          <div className="page1 relative">
            {/* Hero Section */}
            <div className="absolute -top-9 lg:-top-2/3 lg:left-1/2 lg:-translate-x-1/2 lg:translate-y-1/2 w-full h-screen flex flex-col justify-center items-center text-white px-6">
              <h3 className="masked text-5xl md:text-7xl tracking-tighter font-bold pb-4">Edu Tracking System</h3>
              <h5 className="mt-2 text-sm md:text-lg lg:text-xl">Developed By Code Red Developers</h5>
            </div>

            {/* Canvas for 3D Model */}
            <Canvas
              camera={{
                fov: windowWidth > 1024 ? 12 : 30,  // Adjust field of view based on window size
                position: [0, -10, windowWidth > 1024 ? 150 : 125] // Adjust camera position based on window size
              }}
              style={{ width: "100%", height: "100vh" }}
            >
              {enableOrbit && <OrbitControls enableZoom={false} enablePan={false} />}
              <Environment files="./studio_small_09_4k.exr" />
              <ScrollControls pages={2}>
                <LaptopContainer />
              </ScrollControls>
            </Canvas>
          </div>
          {/* Marquee Page page 2 */}
          <div className="page2 relative w-full min-h-content">
            <Marquee />
          </div>
          {/* page 3 */}
          <div className="page3 relative w-full h-screen bg-black">
            <FAQSection /> {/* Add the FAQSection component here */}
          </div>
          {/* page 4 */}
          <div className="page4 relative w-full h-content bg-black">
            <FeatureSection />
          </div>
          {/* Page 5 - Rotating Cylinder */}
          <div className="page5 relative w-full h-screen bg-black flex flex-col justify-center items-center">
            {/* 3D Canvas - Fullscreen & Responsive */}
            <Canvas
              className="w-full h-full"
              camera={{
                fov: windowWidth > 768 ? 20 : 23, // Adjust FOV for mobile screens
                position: [0, 0, windowWidth > 768 ? 5 : 7], // Adjust position for smaller screens
              }}
            >
              {enableOrbit && <OrbitControls enableZoom={false} enablePan={false} />}
              <ambientLight />
              <RotatingCylinder />
              <EffectComposer>
                <Bloom mipmapBlur intensity={5.0} luminanceThreshold={0} luminanceSmoothing={0} />
              </EffectComposer>
            </Canvas>
          </div>
          {/* page 5 Footer */}
          <div className="page5 relative">
            <Footer />
          </div>
        </div>
      </>
    );
  };

  export default HomePage;
