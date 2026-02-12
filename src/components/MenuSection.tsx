import React from 'react';
import { menuCategories } from '@/data/menuData';
import ProductCard from './ProductCard';

const MenuSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16" id="menu">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Our Menu
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            All items are priced per kilogram (₹/kg). Customization available on request.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {menuCategories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className="animate-slide-up"
              style={{ animationDelay: `${categoryIndex * 0.1}s` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0">
                  <span className="text-3xl">
                    {category.id === 'masala-powders'}
                    {category.id === 'homemade-pickles'}
                    {category.id === 'baby-nutrition'}
                    {category.id === 'adult-powders'}
                    {category.id === 'special-care'}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="flex-grow h-px bg-border ml-4 hidden md:block" />
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {category.items.map((item) => (
                  <ProductCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
