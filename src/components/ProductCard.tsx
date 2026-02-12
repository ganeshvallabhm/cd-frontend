import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { MenuItem, SugarOption, sugarOptions, SpiceLevel, spiceLevels } from '@/data/menuData';
import { getProductImageUrl, FALLBACK_IMAGE } from '@/utils/imageHelper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductCardProps {
  item: MenuItem;
}

const ProductCard: React.FC<ProductCardProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const [sugarOption, setSugarOption] = useState<SugarOption>('With Sugar');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Medium Spicy');
  const { addToCart } = useCart();

  // Determine if spice level selection should be shown (for masala powders and pickles)
  const shouldShowSpiceSelection = () => {
    const categoriesWithSpice = ['masala-powders', 'homemade-pickles'];
    return categoriesWithSpice.includes(item.category);
  };

  // Determine if sugar selection should be shown (for other categories)
  const shouldShowSugarSelection = () => {
    return !shouldShowSpiceSelection();
  };

  const handleAddToCart = () => {
    // Pass appropriate customization based on category
    if (shouldShowSpiceSelection()) {
      addToCart(item, quantity, undefined, spiceLevel);
    } else {
      addToCart(item, quantity, sugarOption, undefined);
    }
    setQuantity(1);
  };

  const incrementQuantity = () => setQuantity(prev => Math.min(prev + 1, 10));
  const decrementQuantity = () => setQuantity(prev => Math.max(prev - 1, 1));

  // Generate a subtle gradient based on category for visual variety
  const getCategoryColor = () => {
    switch (item.category) {
      case 'masala-powders':
        return 'from-orange-50 to-yellow-50';
      case 'homemade-pickles':
        return 'from-green-50 to-lime-50';
      case 'baby-nutrition':
        return 'from-pink-50 to-rose-50';
      case 'adult-powders':
        return 'from-amber-50 to-orange-50';
      case 'special-care':
        return 'from-purple-50 to-pink-50';
      default:
        return 'from-cream to-cream-dark';
    }
  };

  return (
    <div className={`group relative rounded-2xl bg-gradient-to-br ${getCategoryColor()} p-4 shadow-soft hover:shadow-card transition-all duration-300`}>
      {/* Product Image */}
      <div className="w-full aspect-square rounded-xl bg-card/80 flex items-center justify-center mb-3 overflow-hidden">
        <img
          src={getProductImageUrl(item.name)}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>

        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">₹{item.price}</span>
          <span className="text-xs text-muted-foreground">/ kg</span>
        </div>

        {/* Sugar Option Selector - Only show for categories that support it */}
        {shouldShowSugarSelection() && (
          <div className="pt-1">
            <label className="text-[10px] text-muted-foreground block mb-1">
              Sugar / Jaggery Option
            </label>
            <Select value={sugarOption} onValueChange={(value) => setSugarOption(value as SugarOption)}>
              <SelectTrigger className="h-8 text-xs bg-card">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {sugarOptions.map((option) => (
                  <SelectItem key={option} value={option} className="text-xs">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Spice Level Selector - Only show for masala powders and pickles */}
        {shouldShowSpiceSelection() && (
          <div className="pt-1">
            <label className="text-[10px] text-muted-foreground block mb-1">
              Spice Level
            </label>
            <Select value={spiceLevel} onValueChange={(value) => setSpiceLevel(value as SpiceLevel)}>
              <SelectTrigger className="h-8 text-xs bg-card">
                <SelectValue placeholder="Select spice level" />
              </SelectTrigger>
              <SelectContent className="bg-card">
                {spiceLevels.map((level) => (
                  <SelectItem key={level} value={level} className="text-xs">
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1 bg-card rounded-lg p-1">
            <button
              onClick={decrementQuantity}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3 text-muted-foreground" />
            </button>
            <span className="w-6 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={incrementQuantity}
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex-1 gap-1 text-xs h-8"
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
