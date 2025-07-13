'use client';

import { Button } from '@/components';
import SplitText from '@/components/ui/split-text';
import Image from 'next/image';
import React from 'react';
import { toast } from 'sonner';

const HeroSection = () => {
  const onExploreClick = () => {
    toast.success("Let's explore the app, by Logging in!");
  };

  const onNoMoneyClick = () => {
    toast.warning('This place is not for you,  babe!');
  };

  return (
    <section className="flex min-h-[70vh] w-full items-center justify-center px-6 py-12 pb-6">
      <div className="mx-auto max-w-3xl text-center">
        <div className="flex w-full items-center justify-center">
          <Image src={'/logo.png'} alt="Where'd It Go Logo" width={120} height={120} />
        </div>
        <SplitText text={'Track money without losing mind'} textClassName="text-center mb-2" />
        <SplitText
          textClassName="mb-8 text-base leading-relaxed font-normal text-center text-gray-300 md:text-lg"
          text="A smart, witty finance tracker that shows where your money went - and how to stop it from
          ghosting you again next month."
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button size="sm" onClick={onExploreClick}>
            Let&apos;s Explore
          </Button>
          <Button size="sm" variant="ghost" onClick={onNoMoneyClick}>
            I&apos;ve No Money
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
