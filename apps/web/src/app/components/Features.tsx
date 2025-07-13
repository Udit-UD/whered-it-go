'use client';
// ** EXTERNAL IMPORTS **

import React, { useEffect, useRef } from 'react';
import _ from 'lodash';

// ** INTERNAL IMPORTS **

import { Feature } from '@/types';

// ** RELATIVE IMPORTS **
import { FEATURES } from './utils';

const Card = ({ feature }: { feature: Feature }) => {
  return (
    <div className="group relative flex h-64 w-72 flex-shrink-0 flex-col items-start space-y-4 rounded-md border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 transition-all duration-300 hover:scale-105 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20">
      <div className="rounded-lg bg-gray-800/50 p-3 transition-colors duration-300 group-hover:bg-gray-700/50">
        {feature.icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-100">{feature.name}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
      </div>
    </div>
  );
};

const Features = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1; // Adjust speed (pixels per frame)

    const animate = () => {
      if (scrollContainer) {
        scrollPosition += scrollSpeed;

        // Reset position when we've scrolled past half the content
        // This creates seamless infinite scrolling
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0;
        }

        scrollContainer.scrollLeft = scrollPosition;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Pause animation on hover
    const handleMouseEnter = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    const handleMouseLeave = () => {
      animationRef.current = requestAnimationFrame(animate);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Double the features array for seamless infinite scrolling
  const doubledFeatures = [...FEATURES, ...FEATURES];

  return (
    <section className="w-full py-16 pt-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="mb-4 text-2xl font-bold text-gray-100">Features</h2>
          <div className="border-t border-gray-800 bg-[#0a0a0a]"></div>
        </div>

        {/* Features Scroll */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="overflow-hidden"
            style={{
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <div className="flex gap-2 p-4" style={{ width: 'max-content' }}>
              {_.map(doubledFeatures, (feature: Feature, index: number) => (
                <Card key={`${feature.name}-${index}`} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for hiding scrollbar */}
      <style jsx global>{`
        .overflow-hidden::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Features;
