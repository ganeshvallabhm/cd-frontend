import React from 'react';
import { Truck, RefreshCw, FileText, Clock } from 'lucide-react';

const policies = [
  {
    icon: Truck,
    title: 'Delivery Policy',
    points: [
      'Delivery within 3 days of order confirmation',
      'Currently serving Bangalore only',
      'Delivery charges calculated based on location',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Refund Policy',
    points: [
      'Quality issues reported within 24 hours of delivery',
      'Full refund or replacement for damaged products',
      'Refunds processed within 5-7 business days',
      'Contact us via email for quick resolution',
    ],
  },
  {
    icon: FileText,
    title: 'Terms & Conditions',
    points: [
      'All products are 100% homemade with no preservatives',
      'Prices are per kilogram (₹/kg)',
      'Customization available on request',
    ],
  },
  {
    icon: Clock,
    title: 'Shelf Life',
    points: [
      'Masala powders: 3-4 months in airtight container',
      'Pickles: 6-8 months when refrigerated',
      'Baby foods: 2-3 months in cool, dry place',
      'Laddoos: 15-20 days at room temperature',
    ],
  },
];

const PoliciesSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16" id="policies">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Policies & Information
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about ordering from us
          </p>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {policies.map((policy, index) => {
            const Icon = policy.icon;
            return (
              <div
                key={policy.title}
                className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                {/* Title */}
                <h3 className="font-display font-semibold text-foreground text-lg mb-3">
                  {policy.title}
                </h3>

                {/* Points */}
                <ul className="space-y-2">
                  {policy.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PoliciesSection;
