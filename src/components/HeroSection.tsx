import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden gradient-hero py-12 md:py-20">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-in">
            <span className="text-sm font-medium">
              Delivering Fresh Across Bangalore
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 animate-slide-up">
            Home Food at{' '}
            <span className="text-primary">Your Doorstep</span>
          </h1>

          {/* Subtext */}
          <p
            className="text-muted-foreground text-lg md:text-xl mb-8 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            Fresh homemade foods delivered within 3 days across Bangalore.
            Made with love, just like mother's cooking.
          </p>

          {/* Trust Badges */}
          <div
            className="flex flex-wrap justify-center gap-4 md:gap-6 animate-slide-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="px-5 py-2 rounded-xl bg-card shadow-soft">
              <span className="text-sm font-medium text-foreground">
                No Preservatives
              </span>
            </div>

            <div className="px-5 py-2 rounded-xl bg-card shadow-soft">
              <span className="text-sm font-medium text-foreground">
                100% Homemade
              </span>
            </div>

            <div className="px-5 py-2 rounded-xl bg-card shadow-soft">
              <span className="text-sm font-medium text-foreground">
                Custom Orders
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
