'use client';

import React from 'react';
import { Instagram, Youtube, Twitter, Mail, Users, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Instagram',
      icon: <Instagram className="h-5 w-5" />,
      href: '#',
      color: 'hover:text-pink-400',
    },
    {
      name: 'YouTube',
      icon: <Youtube className="h-5 w-5" />,
      href: '#',
      color: 'hover:text-red-400',
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-5 w-5" />,
      href: '#',
      color: 'hover:text-blue-400',
    },
  ];

  const footerLinks = [
    {
      name: 'Contact Us',
      icon: <Mail className="h-4 w-4" />,
      href: '#',
    },
    {
      name: 'Careers',
      icon: <Users className="h-4 w-4" />,
      href: '#',
    },
  ];

  return (
    <footer className="w-full border-t border-gray-800 bg-[#0a0a0a]">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div>
                <span className="text-lg font-bold text-white">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-100">Where&apos;d It Go?</h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Making money tracking less painful, one witty notification at a time. Your
              wallet&apos;s new best friend (sorry, old wallet).
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Founded by Supereme, built for savers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-200">Quick Links</h4>
            <div className="space-y-3">
              {footerLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center space-x-2 text-gray-400 transition-colors duration-200 hover:text-gray-200"
                >
                  {link.icon}
                  <span className="text-sm">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-200">Follow Our Journey</h4>
            <p className="text-sm text-gray-400">
              Behind-the-scenes chaos, financial tips, and probably some memes.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800/50 p-3 text-gray-400 transition-all duration-200 hover:border-gray-600 hover:bg-gray-700/50 ${social.color}`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-500 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-4">
              <span>© {currentYear} Where&apos;d It Go?</span>
              <span className="hidden md:inline">•</span>
              <span className="text-gray-400">
                All rights reserved (including the right to make dad jokes)
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400">Made with</span>
              <Heart className="h-4 w-4 text-red-400" />
              <span className="text-gray-400">and empty pockets</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
