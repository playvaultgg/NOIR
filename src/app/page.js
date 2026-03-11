import HeroSection from "@/components/home/HeroSection";
import RecommendedForYou from "@/components/ai/RecommendedForYou";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import ShowroomPreview from "@/components/home/ShowroomPreview";
import RunwayPreview from "@/components/home/RunwayPreview";
import OutfitBuilderPreview from "@/components/home/OutfitBuilderPreview";
import ProductGrid from "@/components/home/ProductGrid";
import CustomerReviews from "@/components/home/CustomerReviews";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";
import { getPersonalizedRecommendations } from "@/modules/ai/ai.service";

/**
 * Maison NOIR - Enhanced Global Homepage
 * Full NOIR Homepage Layout (₹10L Luxury UI Integration)
 * Flow:
 * 1. Cinematic Hero
 * 2. AI Recommendations
 * 3. Collections Showcase
 * 4. 3D Showroom Preview
 * 5. Runway Experience
 * 6. Outfit Builder (3D Styler Teaser)
 * 7. Luxury Product Grid
 * 8. Social Proof (Customer Reviews)
 * 9. FAQ Section
 * 10. Contact Section
 */
export default async function Home() {
  const recommended = await getPersonalizedRecommendations();

  return (
    <div className="relative w-full overflow-hidden bg-noir-black selection:bg-noir-gold selection:text-noir-black">
      {/* 1. Cinematic Hero Section (@reactbits-pro/hero-12) */}
      <HeroSection />

      {/* 2. AI Personalized Section (RecommendedForYou) */}
      <div className="px-6 lg:px-24">
        <RecommendedForYou products={recommended} title="Tailored for Your Silhouette" />
      </div>

      {/* 3. Featured Collections Showcase */}
      <CollectionShowcase />

      {/* 4. Virtual Showroom 3D Preview */}
      <ShowroomPreview />

      {/* 5. Runway Experience Preview */}
      <RunwayPreview />

      {/* 6. AI Outfit Builder (3D Styler) Preview */}
      <OutfitBuilderPreview />

      {/* 7. Luxury Product Grid Catalogue */}
      <ProductGrid products={recommended} />

      {/* 8. Social Proof & Testimonials */}
      <CustomerReviews />

      {/* 9. FAQ Knowledge Discovery */}
      <FAQSection />

      {/* 10. Concierge Contact Section */}
      <ContactSection />
    </div>
  );
}
