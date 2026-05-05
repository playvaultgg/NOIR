export default async function sitemap() {
    const baseUrl = "https://maisonoir.com";

    // Standard static routes
    const routes = [
        "",
        "/collections",
        "/about",
        "/contact",
        "/custom-perfume",
        "/runway",
        "/showroom",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: route === "" ? 1 : 0.8,
    }));

    return [...routes];
}
