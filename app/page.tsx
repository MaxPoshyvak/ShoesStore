import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandsStrip from "@/components/BrandsStrip";
import Trending from "@/components/Trending";
import PromoBanner from "@/components/PromoBanner";
import BestSelling from "@/components/BestSelling";
import CustomerReviews from "@/components/CustomerReviews";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <BrandsStrip />
            <Trending />
            <PromoBanner />
            <BestSelling />
            <CustomerReviews />
            <Footer />
        </main>
    );
}

