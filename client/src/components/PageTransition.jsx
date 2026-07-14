import React from 'react';
import { motion } from 'framer-motion';

const PageTransition = ({ children }) => {
  return (
    // Perspective creates the 3D depth. Without it, rotateY just looks like horizontal squishing.
    <div style={{ perspective: '2500px', width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <motion.div
        // Start: Page is flipped 90 degrees open (sticking straight out at the viewer)
        initial={{ rotateY: 90, opacity: 0, scale: 0.95 }}
        // Animate: Page slams shut down onto the screen
        animate={{ rotateY: 0, opacity: 1, scale: 1 }}
        // Exit: Page flips back up towards the viewer when leaving
        exit={{ rotateY: -90, opacity: 0, scale: 0.95 }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1], // Custom snap-easing for physical paper feel
        }}
        style={{
          transformOrigin: 'left center', // The "spine" is on the left edge
          width: '100%',
          minHeight: '100vh',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          backgroundColor: '#FAF8F2' // Vintage paper base color so the back of the turning page isn't purely transparent
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default PageTransition;
