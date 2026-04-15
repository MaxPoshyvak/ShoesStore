import Hero from "@/components/Hero";
import BrandsStrip from "@/components/BrandsStrip";
import Trending from "@/components/Trending";
import PromoBanner from "@/components/PromoBanner";
import BestSelling from "@/components/BestSelling";
import CustomerReviews from "@/components/CustomerReviews";

export default function Home() {
    return (
        <main>
            <Hero />
            <BrandsStrip />
            <Trending />
            <PromoBanner />
            <BestSelling />
            <CustomerReviews />
        </main>
    );
}