import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  product: string;
}

const reviews: Review[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    location: 'Koramangala',
    rating: 5,
    text: "The sambar powder reminds me of my grandmother's cooking. Absolutely authentic taste! I've been ordering regularly for 6 months now.",
    product: 'Sambar Powder',
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    location: 'Indiranagar',
    rating: 5,
    text: 'My baby loves the Ragi Seri. Very happy to find preservative-free baby food. The texture and taste are perfect.',
    product: 'Ragi Seri',
  },
  {
    id: '3',
    name: 'Lakshmi Venkatesh',
    location: 'Jayanagar',
    rating: 5,
    text: 'The mango pickle is exactly like how we make at home. Fresh, tangy, and with the perfect amount of spice. Highly recommend!',
    product: 'Mango Pickle',
  },
  {
    id: '4',
    name: 'Arun Prasad',
    location: 'Whitefield',
    rating: 5,
    text: 'Dry Fruit Laddoos are a hit at every family gathering. Premium quality and great taste. Worth every rupee!',
    product: 'Dry Fruit Laddoo',
  },
];

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-soft hover:shadow-card transition-shadow duration-300">
      {/* Quote Icon */}
      <div className="mb-3">
        <Quote className="w-6 h-6 text-primary/30" />
      </div>

      {/* Review Text */}
      <p className="text-foreground text-sm leading-relaxed mb-4">
        "{review.text}"
      </p>

      {/* Product Tag */}
      <div className="mb-4">
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
          {review.product}
        </span>
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-foreground text-sm">{review.name}</h4>
          <p className="text-xs text-muted-foreground">{review.location}</p>
        </div>
        
        {/* Stars */}
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < review.rating ? 'text-accent fill-accent' : 'text-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ReviewsSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real reviews from happy customers across Bangalore
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
