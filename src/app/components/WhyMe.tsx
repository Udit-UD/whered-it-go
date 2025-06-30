'use client';

import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Reason } from '@/types';
import { REASONS } from './utils';

const ReasonCard = ({ reason }: { reason: Reason }) => {
  return (
    <div className="group flex flex-col items-start space-y-4 rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 transition-all duration-300 hover:border-gray-600 hover:shadow-lg hover:shadow-gray-900/20">
      <div className="rounded-lg bg-gray-800/50 p-3 transition-colors duration-300 group-hover:bg-gray-700/50">
        {reason.icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-100">{reason.title}</h3>
        <p className="text-sm leading-relaxed text-gray-400">{reason.description}</p>
      </div>
    </div>
  );
};

const WhyMe = () => {
  return (
    <section className="w-full py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-100">
            Why Choose <span className="text-blue-400">Where&apos;d It Go?</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Stop playing hide and seek with your money. We make financial tracking so simple, even
            your wallet will thank you (if it could talk, it would probably apologize first).
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <ReasonCard key={index} reason={reason} />
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-16 rounded-2xl border border-gray-800 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-blue-900/20 p-8 text-center">
          <h3 className="mb-4 text-2xl font-semibold text-gray-100">
            Ready to Stop Your Money from Ghosting You?
          </h3>
          <p className="mb-6 text-gray-400">
            Join the beta crew and help us build the finance tracker that doesn&apos;t suck.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Completely Free</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">No ads, no catch</span>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm">Early access perks</span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid gap-8 text-center md:grid-cols-3">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-blue-400">100+</div>
            <div className="text-sm text-gray-400">Beta Testers</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-green-400">₹0</div>
            <div className="text-sm text-gray-400">Cost (Forever)</div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-purple-400">∞</div>
            <div className="text-sm text-gray-400">Dad Jokes Included</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyMe;
