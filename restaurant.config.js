/**
 * Restaurant Configuration
 * Change these values to white-label this app for a new restaurant
 */
module.exports = {
  // Restaurant Info
  name: "Angie's Kebabs & Burgers",
  tagline: "Fresh & Flavourful Every Time",
  description: "Handcrafted kebabs and gourmet burgers made with the freshest ingredients.",
  
  // Brand Colors
  primaryColor: "#F5C800",
  darkColor: "#1A1A1A",
  
  // Contact
  phone: "03 9000 0001",
  email: "hello@angiesknb.com",
  website: "https://angiesknb.com",
  
  // Social
  instagram: "https://instagram.com/angiesknb",
  facebook: "https://facebook.com/angiesknb",
  
  // Locations
  locations: [
    { name: "St Albans", address: "123 Main St, St Albans VIC 3021" },
    { name: "Fitzroy North", address: "456 High St, Fitzroy North VIC 3068" },
    { name: "Ascot Vale", address: "789 Union Rd, Ascot Vale VIC 3032" },
  ],
  
  // Features
  hasDelivery: true,
  hasPickup: true,
  hasLoyalty: true,
  hasCoupons: true,
  
  // Supabase (set in .env.local)
  // NEXT_PUBLIC_SUPABASE_URL
  // NEXT_PUBLIC_SUPABASE_ANON_KEY
}
