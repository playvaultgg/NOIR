"use client";

import dynamic from "next/dynamic";
import CollectionShowcase from "@/components/home/CollectionShowcase";
import ProductGrid from "@/components/home/ProductGrid";
import BrandStory from "@/components/home/BrandStory";
import CustomerReviews from "@/components/home/CustomerReviews";
import RecruitmentSection from "@/components/home/RecruitmentSection";
import FAQSection from "@/components/home/FAQSection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";

const ShowroomPreview = dynamic(() => import("@/components/home/ShowroomPreview"), { 
    ssr: false,
    loading: () => <div className="h-[600px] bg-noir-surface animate-pulse rounded-3xl" />
});
const RunwayPreview = dynamic(() => import("@/components/home/RunwayPreview"), { 
    ssr: false,
    loading: () => <div className="h-[400px] bg-noir-surface animate-pulse" />
});
const AvatarTryOnPreview = dynamic(() => import("@/components/home/AvatarTryOnPreview"), { 
    ssr: false,
    loading: () => <div className="h-[500px] bg-noir-surface animate-pulse rounded-3xl" />
});

export default function HomeClient({ products }) {
    return (
        <main className="relative w-full overflow-hidden bg-noir-black selection:bg-noir-gold selection:text-noir-black">
            <HeroSection />
            <CollectionShowcase />
            <ShowroomPreview />
            <RunwayPreview />
            <AvatarTryOnPreview />
            <BrandStory />
            <CustomerReviews />
            <RecruitmentSection />
            <FAQSection />
            <ContactSection />
        </main>
    );
}
