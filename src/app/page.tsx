import React from 'react';
import { HeroSection, Features, WhyMe, Footer } from './components';

const page = () => {
  return (
    <div className="flex h-auto w-3/4 flex-col items-center justify-center self-center">
      {/* MAIN COMPONENT */}
      <HeroSection />
      {/* FEATURES */}
      <Features />
      {/* ABOUT */}
      <WhyMe />
      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default page;
