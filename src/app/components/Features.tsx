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
    <div className="group relative flex h-64 w-72 flex-shrink-0 flex-col items-start space-y-4 rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 transition-all duration-300 hover:scale-105 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20">
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);
  const isAutoScrollingRef = useRef<boolean>(true);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 1; // pixels per frame

    const autoScroll = () => {
      if (!scrollContainer || !isAutoScrollingRef.current) return;

      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
      const oneSetWidth = (scrollWidth - clientWidth) / 2; // Adjusted calculation

      // If we've scrolled past one complete set, reset to the beginning
      if (scrollLeft >= oneSetWidth) {
        scrollContainer.scrollLeft = 0;
      } else {
        scrollContainer.scrollLeft += scrollSpeed;
      }

      animationIdRef.current = requestAnimationFrame(autoScroll);
    };

    // Start auto-scrolling
    animationIdRef.current = requestAnimationFrame(autoScroll);

    // Pause auto-scroll on hover
    const handleMouseEnter = () => {
      isAutoScrollingRef.current = false;
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };

    const handleMouseLeave = () => {
      isAutoScrollingRef.current = true;
      animationIdRef.current = requestAnimationFrame(autoScroll);
    };

    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Duplicate features for infinite scroll effect
  const duplicatedFeatures = [...FEATURES, ...FEATURES];

  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="mb-4">
          <h2 className="mb-4 text-3xl font-bold text-gray-100">Features</h2>
          <div className="border-t border-gray-800 bg-[#0a0a0a]"></div>
        </div>

        {/* Features Scroll */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto"
            style={{
              scrollBehavior: 'auto',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <div className="flex gap-6 p-4" style={{ width: 'max-content' }}>
              {_.map(duplicatedFeatures, (feature: Feature, index: number) => (
                <Card key={`${feature.name}-${index}`} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for hiding scrollbar */}
      <style jsx global>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default Features;
