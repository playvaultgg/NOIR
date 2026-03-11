"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";

export default function ProductGrid({ products }) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.15
                    }
                }
            }}
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-8 gap-y-16"
        >
            {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
            ))}
        </motion.div>
    );
}
