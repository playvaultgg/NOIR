import dynamic from "next/dynamic";

const PerfumeBuilder = dynamic(() => import("@/components/3d/PerfumeBuilder"), { ssr: false });

export const metadata = {
    title: "Custom Perfume Builder | Maison NOIR",
    description: "Craft your bespoke signature scent. Choose fragrance notes, bottle design, and engraving — made exclusively for you.",
};

export default function CustomPerfumePage() {
    return <PerfumeBuilder />;
}
