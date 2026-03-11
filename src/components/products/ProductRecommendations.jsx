"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

export default function ProductRecommendations({ products = [] }) {
    if (products.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {products.map((product, idx) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                        duration: 1.2,
                        ease: [0.16, 1, 0.3, 1],
                        delay: idx * 0.15
                    }}
                >
                    <ProductCard product={product} />
                </motion.div>
            ))}
        </div>
    );
}
