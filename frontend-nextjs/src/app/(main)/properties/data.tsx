import { PropertyData } from "./[slug]/page";

// Mock property data based on the fetched content
const propertyData: PropertyData = {
  id: "DNA-08",
  title: "Selvara Grand Polo Club Villas",
  price: 6200000,
  priceRange: "AED 6.2M - 7.8M",
  propertyType: "Villa",
  status: "Off Plan",
  bedrooms: 4,
  bathrooms: 3,
  size: "3,638-3,832 sqft",
  plotSize: "Private gardens and courtyards",
  yearBuilt: 2029,
  location: {
    address: "Dubai Investment Park 2",
    area: "Dubai Investments Park",
    city: "Dubai",
    country: "United Arab Emirates"
  },
  description: "Selvara is a new enclave of elegant 4-bedroom villas meticulously crafted by Emaar Properties within the prestigious Grand Polo Club & Resort masterplan in Dubai Investments Park 2 (DIP 2). Each home blends equestrian heritage with contemporary design and lush open spaces.",
  features: [
    "Semi-detached and detached 4-bedroom villas",
    "Built areas between ~3,638–3,832 sq ft",
    "Minimalist architecture with sculptural forms",
    "Earthy tones and natural stone finishes",
    "Timber finishes throughout",
    "Double-height foyers",
    "Open-plan layouts",
    "Some villas include roof terraces",
    "Maid's room included",
    "Private gardens and courtyards",
    "Golden Visa eligibility"
  ],
  amenities: [
    "Championship polo fields",
    "Equestrian stables",
    "Luxury polo clubhouse",
    "Yoga pavilion",
    "Fitness center",
    "Swimming pools",
    "Sensory gardens",
    "Outdoor play parks",
    "Dog park",
    "Padel courts",
    "Basketball courts",
    "Football courts",
    "Walking trails",
    "Mini-golf",
    "Landscaped communal greens",
    "Shaded boulevards"
  ],
  images: [
    "/images/banner-1.jpg",
    "/images/banner-2.jpg",
    "/images/banner-1.jpg",
    "/images/banner-2.jpg",
    "/images/banner-1.jpg"
  ],
  floorPlans: [
    "/images/banner-1.jpg",
    "/images/banner-2.jpg"
  ],
  energyRating: "A+",
  developer: "Emaar Properties",
  paymentPlan: {
    downPayment: "10%",
    duringConstruction: "70%",
    onHandover: "20%"
  },
  handover: "Q2 2029",
  agent: {
    name: "Realtor Zabir",
    phone: "+971 50 123 4567",
    email: "zabir@dnaproperties.com",
    image: "/images/banner-1.jpg"
  }
};

const similarProperties = [
  {
    id: 1,
    title: "Athlon by Aldar – Dubai's First Active Living Community",
    price: "AED 2,800,000",
    location: "Global Village",
    image: "/images/banner-1.jpg",
    slug: "athlon-by-aldar"
  },
  {
    id: 2,
    title: "Nad Al Sheba Gardens Villas by Meraas",
    price: "AED 4,430,000",
    location: "Nad Al Sheba, Dubai",
    image: "/images/banner-2.jpg",
    slug: "nad-al-sheba-gardens-villas"
  },
  {
    id: 3,
    title: "Golf Place Villa – 6 Bedrooms",
    price: "Contact for Price",
    location: "Golf Place, Dubai Hills Estate",
    image: "/images/banner-1.jpg",
    slug: "golf-place-villa"
  }
];

export {
    propertyData,
    similarProperties
}