import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import CartDrawer from '@/components/CartDrawer';
import ReviewsSection from '@/components/ReviewsSection';
import PoliciesSection from '@/components/PoliciesSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <MenuSection />
        <ReviewsSection />
        <PoliciesSection />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default Index;
