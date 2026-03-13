import HomeClient from "./HomeClient";
import { getProductsByCategory } from "@/modules/products/product.service";

export default async function Home() {
  const products = await getProductsByCategory("MENS");
  
  return <HomeClient products={products} />;
}
