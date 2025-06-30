import { Button } from '@/components';
import React from 'react';

const HeroSection = () => {
  return (
    <section className="flex min-h-[70vh] w-full items-center justify-center px-6 py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="mb-6 text-2xl leading-tight font-bold text-white md:text-4xl">
          Track money without losing mind
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-gray-300 md:text-xl">
          A smart, witty finance tracker that shows where your money went - and how to stop it from
          ghosting you again next month.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="sm" className="bg-white text-black">
            Let&apos;s Explore
          </Button>
          <Button size="sm" variant="secondary">
            I&apos;m Berozgar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
