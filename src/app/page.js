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
import { getPersonalizedRecommendations } from "@/modules/ai/ai.service";

/**
 * Maison NOIR - Enhanced Global Homepage
 * Flow: 1. Hero, 2. AI Recs, 3. Collections, 4. Showroom, 5. Runway, 6. Avatar, 7. Product Grid, 8. Brand Story, 9. Reviews, 10. FAQ, 11. Contact.
 */
export default async function Home() {
  const recommended = await getPersonalizedRecommendations();

  return (
    <div className="relative w-full overflow-hidden bg-noir-black selection:bg-noir-gold selection:text-noir-black">
      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. AI Personalized Section */}
      <div className="px-6 lg:px-24">
        <RecommendedForYou products={recommended} title="Tailored for Your Silhouette" />
      </div>

      {/* 3. Featured Collections Showcase */}
      <CollectionShowcase />

      {/* 4. Virtual Showroom 3D Preview */}
      <ShowroomPreview />

      {/* 5. Runway Experience Preview */}
      <RunwayPreview />

      {/* 6. Identity Synthesis (Avatar Try-On) Preview */}
      <AvatarTryOnPreview />

      {/* 7. Luxury Product Grid Catalogue */}
      <ProductGrid products={recommended} />

      {/* 8. Brand Narrative (Brand Story) */}
      <BrandStory />

      {/* 9. Social Proof & Testimonials */}
      <CustomerReviews />

      {/* 10. FAQ Knowledge Discovery */}
      <FAQSection />

      {/* 11. Concierge Contact Section */}
      <ContactSection />
    </div>
  );
}
