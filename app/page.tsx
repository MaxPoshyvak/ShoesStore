import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BrandsStrip from "@/components/BrandsStrip";
import Trending from "@/components/Trending";

export default function Home() {
    return (
        <main>
            <Navbar />
            <Hero />
            <BrandsStrip />
            <Trending />

        </main>
    );
}

