import { ArrowLeft, Search, ShoppingCart, Star, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = ["All", "Electronics", "Fashion", "Food", "Beauty", "Home"];

const PRODUCTS = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: 2499,
    category: "Electronics",
    seller: "TechZone",
    rating: 4.5,
    emoji: "🎧",
    color: "bg-blue-900",
    desc: "Crystal clear audio with 30hr battery life. True wireless with noise cancellation. Comes with charging case and 3 ear tip sizes.",
  },
  {
    id: 2,
    name: "Silk Evening Dress",
    price: 3200,
    category: "Fashion",
    seller: "StyleHub",
    rating: 4.8,
    emoji: "👗",
    color: "bg-pink-900",
    desc: "Premium silk blend floor-length evening gown. Available in red, black, and navy. Sizes XS to XXL.",
  },
  {
    id: 3,
    name: "Artisan Spice Box",
    price: 850,
    category: "Food",
    seller: "SpiceRoute",
    rating: 4.9,
    emoji: "🌶️",
    color: "bg-orange-900",
    desc: "12 hand-picked artisan spices from India. Organic, freshly ground, in reusable tins. Perfect gift set.",
  },
  {
    id: 4,
    name: "Vitamin C Serum",
    price: 1100,
    category: "Beauty",
    seller: "GlowUp",
    rating: 4.6,
    emoji: "✨",
    color: "bg-yellow-900",
    desc: "20% Vitamin C brightening serum with hyaluronic acid. Fades dark spots in 4 weeks. Dermatologist tested.",
  },
  {
    id: 5,
    name: "Smart LED Strip",
    price: 699,
    category: "Electronics",
    seller: "BrightHome",
    rating: 4.3,
    emoji: "💡",
    color: "bg-purple-900",
    desc: "5m WiFi-controlled RGB LED strip. Works with Alexa & Google Home. Music sync mode included.",
  },
  {
    id: 6,
    name: "Linen Duvet Set",
    price: 4500,
    category: "Home",
    seller: "HomeNest",
    rating: 4.7,
    emoji: "🛏️",
    color: "bg-teal-900",
    desc: "100% Belgian linen duvet cover set. Includes 2 pillowcases. King/Queen/Double sizes. Oeko-Tex certified.",
  },
  {
    id: 7,
    name: "Matte Lip Kit",
    price: 450,
    category: "Beauty",
    seller: "GlowUp",
    rating: 4.4,
    emoji: "💄",
    color: "bg-red-900",
    desc: "12 hour long-lasting matte liquid lipstick. 8 shades. Includes matching liner. Cruelty-free formula.",
  },
  {
    id: 8,
    name: "Handmade Pasta",
    price: 380,
    category: "Food",
    seller: "NonnaCooks",
    rating: 4.9,
    emoji: "🍝",
    color: "bg-amber-900",
    desc: "Authentic Italian egg pasta, hand-rolled. 500g pack. Made fresh daily. Ships with recipe card.",
  },
];

interface Props {
  onBack: () => void;
  onSendProductCard?: (productName: string, price: number) => void;
}

export default function MarketplaceScreen({
  onBack,
  onSendProductCard,
}: Props) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<number[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<
    (typeof PRODUCTS)[0] | null
  >(null);

  const filtered = PRODUCTS.filter(
    (p) =>
      (activeCategory === "All" || p.category === activeCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id]);
    toast.success("Added to cart!");
  };

  const orderInChat = (product: (typeof PRODUCTS)[0]) => {
    onSendProductCard?.(product.name, product.price);
    toast.success(`Order placed for ${product.name}!`);
    setSelectedProduct(null);
    onBack();
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-[#1f2c34] flex-shrink-0">
        <button
          type="button"
          data-ocid="marketplace.back.button"
          onClick={onBack}
          className="p-1 text-white/80 hover:text-white"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-white font-semibold text-[17px] flex-1">
          Marketplace
        </h1>
        <button
          type="button"
          data-ocid="marketplace.cart.button"
          className="relative p-2 text-white/80"
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#25D366] rounded-full text-[9px] text-white font-bold flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </header>

      {/* Search */}
      <div className="px-4 py-2 bg-[#1f2c34] flex-shrink-0">
        <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-white/50" />
          <input
            data-ocid="marketplace.search.input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-white text-[13px] placeholder:text-white/40 outline-none"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")}>
              <X className="w-4 h-4 text-white/50" />
            </button>
          )}
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 px-4 py-2 overflow-x-auto flex-shrink-0 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            data-ocid="marketplace.category.tab"
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-[#25D366] text-white"
                : "bg-muted/60 text-muted-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((product, i) => (
            <button
              key={product.id}
              type="button"
              data-ocid={`marketplace.product.item.${i + 1}`}
              onClick={() => setSelectedProduct(product)}
              className="bg-card rounded-2xl overflow-hidden text-left shadow-sm border border-border/50 hover:border-[#25D366]/40 transition-colors"
            >
              <div
                className={`${product.color} h-32 flex items-center justify-center`}
              >
                <span className="text-6xl">{product.emoji}</span>
              </div>
              <div className="p-3">
                <p className="font-semibold text-[13px] text-foreground leading-snug mb-1">
                  {product.name}
                </p>
                <p className="text-[11px] text-muted-foreground mb-1.5">
                  {product.seller}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-[14px] text-[#25D366]">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-[11px] text-muted-foreground">
                      {product.rating}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div
            data-ocid="marketplace.empty_state"
            className="flex flex-col items-center py-16 gap-3"
          >
            <span className="text-5xl">🛍️</span>
            <p className="text-muted-foreground">No products found</p>
          </div>
        )}
      </div>

      {/* Product detail sheet */}
      {selectedProduct && (
        <>
          <div
            className="absolute inset-0 z-50 bg-black/60"
            onClick={() => setSelectedProduct(null)}
            onKeyDown={(e) => e.key === "Escape" && setSelectedProduct(null)}
            role="button"
            tabIndex={-1}
            aria-label="Close"
          />
          <div
            data-ocid="marketplace.product.sheet"
            className="absolute bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl shadow-2xl max-h-[85%] overflow-y-auto"
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>
            <div
              className={`${selectedProduct.color} h-48 flex items-center justify-center`}
            >
              <span className="text-8xl">{selectedProduct.emoji}</span>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-1">
                <h2 className="font-bold text-[18px] text-foreground flex-1 pr-2">
                  {selectedProduct.name}
                </h2>
                <button
                  type="button"
                  data-ocid="marketplace.product.close_button"
                  onClick={() => setSelectedProduct(null)}
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <p className="text-muted-foreground text-[13px] mb-1">
                Sold by {selectedProduct.seller}
              </p>
              <div className="flex items-center gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${s <= Math.floor(selectedProduct.rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                  />
                ))}
                <span className="text-[13px] text-muted-foreground ml-1">
                  {selectedProduct.rating}
                </span>
              </div>
              <p className="font-bold text-[22px] text-[#25D366] mb-3">
                ₹{selectedProduct.price.toLocaleString()}
              </p>
              <p className="text-[14px] text-muted-foreground leading-relaxed mb-5">
                {selectedProduct.desc}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-ocid="marketplace.add_cart.button"
                  onClick={() => addToCart(selectedProduct.id)}
                  className="flex-1 py-3 border border-[#25D366] text-[#25D366] rounded-2xl font-semibold text-[14px]"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  data-ocid="marketplace.order_in_chat.button"
                  onClick={() => orderInChat(selectedProduct)}
                  className="flex-1 py-3 bg-[#25D366] text-white rounded-2xl font-semibold text-[14px]"
                >
                  Order in Chat
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
