"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Categories data
  const categories = [
    { name: "Engine Parts", href: "/categories/engine" },
    { name: "Brakes", href: "/categories/brakes" },
    { name: "Suspension", href: "/categories/suspension" },
    { name: "Exhaust", href: "/categories/exhaust" },
    { name: "Electrical", href: "/categories/electrical" },
    { name: "Body & Styling", href: "/categories/body" },
    { name: "Wheels & Tires", href: "/categories/wheels" },
    { name: "Accessories", href: "/categories/accessories" },
  ];

  // Social links
  const socials = [
    { icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
    { icon: FaYoutube, href: "https://youtube.com", label: "YouTube" },
  ];

  // Payment methods
  const paymentMethods = [
    { name: "Visa", icon: "💳" },
    { name: "Mastercard", icon: "💳" },
    { name: "Amex", icon: "💳" },
    { name: "PayPal", icon: "💳" },
    { name: "Apple Pay", icon: "💳" },
    { name: "Google Pay", icon: "💳" },
  ];

  // Trust badges
  const trustBadges = [
    { icon: Truck, text: "Free Shipping Over $99" },
    { icon: Shield, text: "Secure Payment" },
    { icon: RotateCcw, text: "30-Day Returns" },
    { icon: CreditCard, text: "0% Financing" },
  ];

  return (
    <footer className="bg-black text-white border-t-4 border-red-600">
      {/* Trust Badges Bar */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustBadges.map((badge, index) => (
              <div
                key={index}
                className="flex items-center justify-center space-x-2 text-gray-300"
              >
                <badge.icon className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white">
                Kebu Motor<span className="text-red-600"> Parts</span>
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted source for high-quality motor parts and accessories.
              Performance, reliability, and style for every ride.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  <p>Corner R25 and Philadelphia Hospital Road.</p>
                  <p>Elandsdoorn, Limpopo, 1030</p>
                  <p>Elandsdoorn,</p>
                  <p>Dennilton, Limpopo, 1030</p>
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  support@kebumotorparts.co.za
                </span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Shop Categories
            </h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service & Newsletter */}
          <div className="space-y-8">
            {/* Customer Service Links */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Customer Service
              </h3>
              <ul className="space-y-2">
                {[
                  "Contact Us",
                  "Shipping Info",
                  "Returns & Exchanges",
                  "FAQs",
                  "Track Order",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Newsletter
              </h3>
              <p className="text-sm text-gray-400 mb-3">
                Get the latest deals and product updates.
              </p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent text-sm"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors duration-200 text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Social & Payment */}
          <div className="space-y-8">
            {/* Social Media */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Follow Us
              </h3>
              <div className="flex space-x-3">
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="bg-gray-900 hover:bg-red-600 p-2.5 rounded-full transition-colors duration-200"
                  >
                    <social.icon className="h-5 w-5 text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                We Accept
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="bg-gray-900 border border-gray-800 rounded-md p-2 flex flex-col items-center justify-center hover:border-red-600 transition-colors duration-200"
                  >
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-[10px] text-gray-400 mt-1">
                      {method.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Badge */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-xs text-gray-400">
                  100% Secure Shopping
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Copyright & Legal */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-500 text-center md:text-left">
              &copy; {currentYear} Kebu Motor Parts. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/shipping-policy"
                className="text-sm text-gray-500 hover:text-red-500 transition-colors duration-200"
              >
                Shipping Policy
              </Link>
            </div>
            <p className="text-sm text-gray-500 text-center md:text-right">
              Designed with <span className="text-red-500">♥</span> for riders
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
