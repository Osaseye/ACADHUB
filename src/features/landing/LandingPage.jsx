import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Pipeline } from './components/Pipeline';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';

function LandingPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans antialiased transition-colors duration-200 overflow-x-hidden selection:bg-primary selection:text-white">
      <Navbar />
      <Hero />
      <Features />
      <Pipeline />
      <CTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
