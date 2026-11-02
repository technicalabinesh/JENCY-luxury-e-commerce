// Curated Luxury Product Catalog for JENCY Atelier
const PRODUCTS_DATA = [
  {
    id: "jcy-001",
    name: "The Aurelia Silk Drape Gown",
    subtitle: "100% Grade-6A Mulberry Silk",
    category: "couture",
    categoryLabel: "Haute Couture",
    price: 480,
    originalPrice: 560,
    rating: 4.9,
    reviewsCount: 38,
    isNew: true,
    isBestseller: true,
    badge: "Capsule Exclusive",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Flowing with ethereal grace, the Aurelia gown is cut on the bias from featherweight 22-momme Mulberry silk. Finished with delicate hand-stitched rolled hems and an adjustable cowl neckline.",
    details: [
      "100% Certified Mulberry Silk (22-momme)",
      "Bias cut contouring with floor-length sweep",
      "Concealed side zipper with mother-of-pearl buttons",
      "Handmade in our Florence atelier"
    ],
    colors: [
      { name: "Champagne Blush", hex: "#E8D8CF" },
      { name: "Pearl Ivory", hex: "#F7F5F0" },
      { name: "Muted Olive", hex: "#7E8270" }
    ],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "jcy-002",
    name: "L'Étoile Baroque Pearl Pendant",
    subtitle: "Organic Australian Pearl & 18K Solid Gold",
    category: "jewelry",
    categoryLabel: "Fine Jewelry",
    price: 340,
    originalPrice: null,
    rating: 5.0,
    reviewsCount: 64,
    isNew: true,
    isBestseller: true,
    badge: "Artisan Handcrafted",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Every baroque pearl carries a unique soul sculpted by nature. Suspended from a dainty 18K solid yellow gold chain with hand-textured beadwork inspired by Mediterranean tides.",
    details: [
      "Natural AAA Baroque Freshwater Pearl (approx. 18mm)",
      "18 Karat Recycled Yellow Gold bail and cable chain",
      "18-inch adjustable drop chain with lobster clasp",
      "Hypoallergenic, nickel-free and certified conflict-free"
    ],
    colors: [
      { name: "Warm Gold", hex: "#D4AF37" },
      { name: "Rose Gold", hex: "#E0A997" },
      { name: "White Gold", hex: "#E5E5E5" }
    ],
    sizes: ["16-18 Inch", "20-22 Inch"]
  },
  {
    id: "jcy-003",
    name: "Sienna Structured Sculptural Bag",
    subtitle: "Full-Grain Italian Calfskin",
    category: "leather",
    categoryLabel: "Leather Goods",
    price: 620,
    originalPrice: 700,
    rating: 4.8,
    reviewsCount: 29,
    isNew: false,
    isBestseller: true,
    badge: "Signature Classic",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "An architectural silhouette featuring gentle curved edges, hand-burnished edge paint, and antique brushed brass hardware. Sized to effortlessly hold daily essentials with timeless composure.",
    details: [
      "Vegetable-tanned full-grain Italian calfskin",
      "Micro-suede luxury interior lining with dual slip pockets",
      "Detachable crossbody strap with custom engraved carabiners",
      "Includes protective organic cotton dust bag"
    ],
    colors: [
      { name: "Warm Terracotta", hex: "#B86B53" },
      { name: "Caramel Latte", hex: "#C69C6D" },
      { name: "Obsidian Noir", hex: "#1C1C1C" }
    ],
    sizes: ["Classic Medium", "Mini Atelier"]
  },
  {
    id: "jcy-004",
    name: "Chantilly Cashmere Ribbed Cardigan",
    subtitle: "Grade-A Mongolian Cashmere",
    category: "couture",
    categoryLabel: "Haute Couture",
    price: 390,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 42,
    isNew: true,
    isBestseller: false,
    badge: "New Season",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Spun from exceptionally soft 2-ply Mongolian cashmere. An understated relaxed fit with dropped shoulders and natural horn buttons that elevates effortless morning lounging or evening travel.",
    details: [
      "100% Pure Mongolian Cashmere (12-gauge knit)",
      "Genuine polished horn button placket",
      "Ribbed collar, cuffs, and gently tapered hem",
      "OEKO-TEX Standard 100 non-toxic certified dye"
    ],
    colors: [
      { name: "Alabaster Cream", hex: "#F3EDE2" },
      { name: "Dusty Rose", hex: "#D6AFA9" },
      { name: "Heather Oatmeal", hex: "#C7BEB3" }
    ],
    sizes: ["XS", "S", "M", "L", "XL"]
  },
  {
    id: "jcy-005",
    name: "Solstice Diamond Pavé Stacking Bands",
    subtitle: "0.45ct Conflict-Free Diamonds & 18K Gold",
    category: "jewelry",
    categoryLabel: "Fine Jewelry",
    price: 520,
    originalPrice: null,
    rating: 5.0,
    reviewsCount: 51,
    isNew: false,
    isBestseller: true,
    badge: "Bestseller",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "Hand-set with micro-pavé conflict-free lab diamonds along a delicately sculpted knife-edge band. Designed to catch light at every angle whether worn solitary or harmoniously stacked.",
    details: [
      "Conflict-free brilliant round diamonds (Color: F-G, Clarity: VS1)",
      "Total diamond weight: approx. 0.45 ct",
      "18 Karat Fairmined Yellow Gold",
      "Laser engraved inner atelier hallmark"
    ],
    colors: [
      { name: "Yellow Gold", hex: "#D4AF37" },
      { name: "Platinum White", hex: "#E2E2E2" },
      { name: "Soft Rose", hex: "#DE9E8E" }
    ],
    sizes: ["5", "6", "7", "8"]
  },
  {
    id: "jcy-006",
    name: "Fleur Sauvage Mulberry Silk Foulard",
    subtitle: "Hand-Painted Floral Print 90x90cm",
    category: "accessories",
    categoryLabel: "Accessories",
    price: 195,
    originalPrice: 230,
    rating: 4.8,
    reviewsCount: 19,
    isNew: true,
    isBestseller: false,
    badge: "Limited Edition",
    images: [
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1584030373081-f37b7bb4fa8e?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "A botanic masterwork inspired by wildflowers blooming across the French Riviera. Featuring exquisite French hand-rolled edging and rich archival pigments that retain their luminosity over decades.",
    details: [
      "100% Pure Mulberry Silk Twill (16mm)",
      "Traditional hand-rolled and hand-stitched borders",
      "Versatile styling: hair tie, neckline wrap, or bag accent",
      "Comes in JENCY signature gold-embossed keepsake case"
    ],
    colors: [
      { name: "Pastel Botanical", hex: "#DEC8BA" },
      { name: "Azure Morning", hex: "#A8BFC9" },
      { name: "Sage Garden", hex: "#A7B39E" }
    ],
    sizes: ["90 x 90 cm"]
  },
  {
    id: "jcy-007",
    name: "Ambre & Fleur Blanche Extrait de Parfum",
    subtitle: "Artisan High-Concentration 50ml",
    category: "living",
    categoryLabel: "Living & Fragrance",
    price: 210,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 77,
    isNew: false,
    isBestseller: true,
    badge: "Maison Scent",
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "An intoxicating blend of wild solar amber, nocturnal jasmine, velvety Madagascar vanilla, and luminous Calabrian bergamot. Crafted in Grasse, France with 28% pure parfum oil concentration.",
    details: [
      "Top: Calabrian Bergamot, Pink Peppercorn, Cardamom",
      "Heart: Wild Jasmine Sambac, Orris Butter, Damask Rose",
      "Base: Solar Amber Resin, Cedarwood, Warm Tonka, Vanilla",
      "Flacon blown from recycled optical glass with weighted brass cap"
    ],
    colors: [
      { name: "Amber Flacon", hex: "#C78248" }
    ],
    sizes: ["50 ml / 1.7 oz", "100 ml / 3.4 oz"]
  },
  {
    id: "jcy-008",
    name: "Palazzo Linen Tailored Trench",
    subtitle: "Belgian Flax Linen & Horn Hardware",
    category: "couture",
    categoryLabel: "Haute Couture",
    price: 540,
    originalPrice: 620,
    rating: 4.7,
    reviewsCount: 22,
    isNew: false,
    isBestseller: false,
    badge: "Editorial Pick",
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
    ],
    description: "An iconic relaxed trench tailored from substantial Belgian flax linen with breathable cupro lining. Belted waist and storm flap silhouette designed for effortless transitional dressing.",
    details: [
      "100% Belgian Certified Flax Linen",
      "Silky breathable Cupro lining",
      "Storm flaps, deep welt pockets, and storm wrist buckles",
      "Includes tonal self-tie belt with antique brass buckle"
    ],
    colors: [
      { name: "Warm Bisque", hex: "#DFCBB9" },
      { name: "Pebble Stone", hex: "#B8B1A6" },
      { name: "Classic Navy", hex: "#222D3E" }
    ],
    sizes: ["S", "M", "L"]
  }
];

// Lookbook stories
const LOOKBOOK_STORIES = [
  {
    title: "The Dawn of Serenity",
    season: "Spring / Summer 2026",
    quote: "Soft silhouettes sculpted for tranquil mornings and golden evenings.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    tag: "High Summer Capsule"
  },
  {
    title: "Quiet Geometry",
    season: "Atelier Jewelry Line",
    quote: "Organic symmetry, conflict-free stones, and gold imbued with human warmth.",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
    tag: "Jewelry Editorial"
  },
  {
    title: "Tactile Heritage",
    season: "Tuscan Leather Crafts",
    quote: "Each stitch honors decades of generational Florentine leatherworking.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    tag: "Artisan Living"
  }
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "JENCY represents the rare nexus where architectural restraint meets sensual luxury. The Aurelia gown is nothing short of poetry in motion.",
    author: "Elena Vance",
    role: "Senior Fashion Director, L'Élégance",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    location: "Paris"
  },
  {
    quote: "The baroque pearl necklace feels singularly unique, like an heirloom passed down through generations. The packaging alone took my breath away.",
    author: "Camille Laurent",
    role: "Private Collector & Interior Stylist",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    location: "Geneva"
  },
  {
    quote: "From customer concierge to the buttery feel of the Tuscan calfskin tote, shopping at JENCY is an unparalleled sensory experience.",
    author: "Sophia Sterling",
    role: "Architectural Digest Contributor",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    location: "New York"
  }
];

