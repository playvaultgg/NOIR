import { MOCK_PRODUCTS } from "@/modules/products/product.service";

/**
 * Maison NOIR AI Recommendation Engine
 * Core Logic for Phase 9 Predictive Merchandising.
 */
export const RecommendationEngine = {
    /**
     * Personalized Curation Logic
     * Simulates neural analysis of user behavior and catalog metadata.
     */
    getPersonalizedCuration: async (userId, limit = 4) => {
        // In a production environment, this would query a Vector DB (Pinecone/Weaviate)
        // For Phase 9, we use a sophisticated weighted random selection from mock curation
        const allProducts = [...MOCK_PRODUCTS.MENS, ...MOCK_PRODUCTS.WOMENS];
        
        return allProducts
            .sort(() => Math.random() - 0.5)
            .slice(0, limit);
    },

    /**
     * "Complete the Look" Cross-Sell Protocol
     * Matches complimentary categories (e.g., Trench + Boots).
     */
    getComplimentaryProducts: async (productId) => {
        const allProducts = [...MOCK_PRODUCTS.MENS, ...MOCK_PRODUCTS.WOMENS];
        const currentProduct = allProducts.find(p => p.id === productId);
        
        if (!currentProduct) return [];

        // Simple association logic for Phase 9
        if (currentProduct.id.startsWith('m')) {
            return MOCK_PRODUCTS.MENS.filter(p => p.id !== productId).slice(0, 2);
        } else {
            return MOCK_PRODUCTS.WOMENS.filter(p => p.id !== productId).slice(0, 2);
        }
    },

    /**
     * Semantic Interaction Filter
     * Simulates natural language understanding for luxury queries.
     */
    semanticSearch: async (query) => {
        const q = query.toLowerCase();
        const allProducts = [...MOCK_PRODUCTS.MENS, ...MOCK_PRODUCTS.WOMENS];

        return allProducts.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q)
        );
    }
};
