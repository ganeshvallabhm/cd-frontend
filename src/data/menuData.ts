export type SugarOption = 'With Sugar' | 'With Jaggery' | 'With Palm Sugar' | 'Without Sugar';

export const sugarOptions: SugarOption[] = [
  'With Sugar',
  'With Jaggery',
  'With Palm Sugar',
  'Without Sugar',
];

export type SpiceLevel = 'Low Spicy' | 'Medium Spicy' | 'Extra Spicy';

export const spiceLevels: SpiceLevel[] = [
  'Low Spicy',
  'Medium Spicy',
  'Extra Spicy',
];

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "masala-powders",
    name: "Masala Powders",
    description: "Authentic spice blends ground fresh",
    items: [
      { id: "rasam-powder", name: "Rasam Powder", price: 650, category: "masala-powders", image: "/images/products/rasam-powder.jpg" },
      { id: "sambar-powder", name: "Sambar Powder", price: 600, category: "masala-powders", image: "/images/products/sambar-powder.png" },
      { id: "vangibath-powder", name: "Vangibath Powder", price: 600, category: "masala-powders", image: "/images/products/vangibath-powder.png" },
      { id: "bisibelebath-powder", name: "Bisibelebath Powder", price: 600, category: "masala-powders", image: "/images/products/bisibelebath-powder.png" },
      { id: "methi-powder", name: "Methi Powder", price: 560, category: "masala-powders", image: "/images/products/methi-powder.png" },
      { id: "chutney-powder", name: "Chutney Powder", price: 600, category: "masala-powders", image: "/images/products/chutney-powder.png" },
      { id: "puliogare-powder", name: "Puliogare Gojju - Powder", price: 600, category: "masala-powders", image: "/images/products/puliogare-gojju-powder.png" },
      { id: "coriander-chutney-powder", name: "Coriander Seeds Chutney Powder", price: 550, category: "masala-powders", image: "/images/products/coriander-seeds-chutney-powder.png" },
    ],
  },
  {
    id: "homemade-pickles",
    name: "Homemade Pickles",
    description: "Traditional recipes, authentic taste",
    items: [
      { id: "mango-pickle", name: "Mango Pickle", price: 500, category: "homemade-pickles", image: "/images/products/mango-pickle.png" },
      { id: "lemon-pickle", name: "Lemon Pickle", price: 500, category: "homemade-pickles", image: "/images/products/lemon-pickle.png" },
      { id: "mixed-vegetable-pickle", name: "Mixed Vegetable Pickle", price: 500, category: "homemade-pickles", image: "/images/products/mixed-vegetable-pickle.png" },
    ],
  },
  {
    id: "baby-nutrition",
    name: "Baby Nutrition Foods",
    description: "Healthy start for little ones",
    items: [
      { id: "ragi-seri-dals", name: "Ragi Seri – with dals and pulses", price: 700, category: "baby-nutrition", image: "/images/products/ragi-seri-with-dals-and-pulses.png" },
      { id: "ragi-seri-dryfruits", name: "Ragi Seri – with dry fruits", price: 1300, category: "baby-nutrition", image: "/images/products/ragi-seri-with-dry-fruits.png" },
    ],
  },
  {
    id: "adult-powders",
    name: "Adult Powders",
    description: "Nutritious health supplements",
    items: [
      { id: "millet-multigrain", name: "Millet / Multigrain Powder", price: 700, category: "adult-powders", image: "/images/products/millet-multigrain-powder.png" },
      { id: "ragi-malt", name: "Ragi Malt", price: 700, category: "adult-powders", image: "/images/products/ragi-malt.png" },
    ],
  },
  {
    id: "special-care",
    name: "Special Care Products",
    description: "Premium nutrition for special needs",
    items: [
      { id: "dryfruit-laddoo", name: "Dry Fruit Laddoo", price: 1900, category: "special-care", image: "/images/products/dry-fruit-laddoo.png" },
    ],
  },
];

export const getAllMenuItems = (): MenuItem[] => {
  return menuCategories.flatMap(category => category.items);
};
