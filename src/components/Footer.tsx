import React from 'react';
import { Instagram, Facebook, MapPin, Phone, Mail, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xl">CK</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">CK Homemade Foods</h3>
                <p className="text-primary-foreground/70 text-sm">From Our Kitchen to Your Heart</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Bringing you authentic, preservative-free homemade foods made with love and tradition. Every product is crafted with care, just like mother's cooking.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>TG layout, Ittmadu BSK 3rd Stage, Bangalore 560085</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+91 63611 50287</span>
              </li>
              <li className="flex items-center gap-3 text-primary-foreground/70 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hello@ckhomemadefoods.com</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex gap-3 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
            <p className="text-primary-foreground/70 text-sm">
              Follow us for updates and offers!
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/60 text-sm text-center sm:text-left">
              © 2024 CK Homemade Foods. All rights reserved by{' '}
              <a
                href="https://www.linkedin.com/in/ganesh-vallabh-m-a01917300"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors underline"
              >
                GANESH VALLABH M
              </a>
            </p>
            <p className="text-primary-foreground/60 text-sm flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-primary fill-primary" /> in Bangalore
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
