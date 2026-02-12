import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Instagram,
  Facebook,
  Linkedin,
  MessageCircle,
  ShoppingCart,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';

const Header: React.FC = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg md:text-xl">
                CK
              </span>
            </div>
            <div className="flex flex-col">
              <h1 className="font-display font-bold text-foreground text-base md:text-lg leading-tight">
                CK Homemade Foods
              </h1>
              <p className="text-muted-foreground text-xs hidden sm:block">
                From Our Kitchen to Your Heart
              </p>
            </div>
          </div>

          {/* Social & Cart */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex items-center gap-2">

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/+916361150287"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

            </div>

            <Link
              to="/admin/orders"
              className="text-sm font-medium hover:text-primary transition-colors mr-4 hidden md:block"
            >
              Admin
            </Link>

            <Button
              variant="outline"
              size="sm"
              className="relative flex items-center gap-2 border-primary/30 hover:bg-primary hover:text-primary-foreground"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
