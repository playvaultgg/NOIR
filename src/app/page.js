import HeroSection from "@/components/home/HeroSection";
import RecommendedForYou from "@/components/ai/RecommendedForYou";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import ShowroomPreview from "@/components/home/ShowroomPreview";
import RunwayPreview from "@/components/home/RunwayPreview";
import AvatarTryOnPreview from "@/components/home/AvatarTryOnPreview";
import ProductGrid from "@/components/home/ProductGrid";
import BrandStory from "@/components/home/BrandStory";
import CustomerReviews from "@/components/home/CustomerReviews";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";

/**
 * Maison NOIR - Ultra-Luxury Global Homepage
 * Orchestrates 11 distinct interaction layers for a ₹1 Crore digital experience.
 */
export default function Home() {
  return (
    <main className="relative w-full overflow-hidden bg-noir-black selection:bg-noir-gold selection:text-noir-black">
      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. AI Personalized Section (Neural Curation) */}
      <RecommendedForYou />

      {/* 3. Featured Collections Showcase */}
      <CollectionShowcase />

      {/* 4. Virtual Showroom 3D Preview */}
      <ShowroomPreview />

      {/* 5. Runway Experience Preview */}
      <RunwayPreview />

      {/* 6. Identity Synthesis (Avatar Try-On) Preview */}
      <AvatarTryOnPreview />

      {/* 7. Luxury Product Grid Catalogue */}
      <ProductGrid />

      {/* 8. Brand Narrative (Brand Story) */}
      <BrandStory />

      {/* 9. Social Proof & Testimonials */}
      <CustomerReviews />

      {/* 10. FAQ Knowledge Discovery */}
      <FAQSection />

      {/* 11. Concierge Contact Section */}
      <ContactSection />
    </main>
  );
}
