import HomeClient from "./HomeClient";
import { getFeaturedProducts } from "@/modules/products/product.service";

export default async function Home() {
  const products = await getFeaturedProducts();
  
  return <HomeClient products={products} />;
}
