import styles from "./BrandsStrip.module.css";
import Image from "next/image";

export default function BrandsStrip() {

    return (
        <section className={styles.brend}>
            <div className={styles.brandsStrip}>
                <Image src="/ebay.svg" alt="Brand 1" width={100} height={50} />
                <Image src="/amazon.svg" alt="Brand 2" width={100} height={50} />
                <Image src="/Ajio.svg" alt="Brand 3" width={100} height={50} />

                <Image src="/ebay.svg" alt="Brand 1" width={100} height={50} />
                <Image src="/amazon.svg" alt="Brand 2" width={100} height={50} />
                <Image src="/Ajio.svg" alt="Brand 3" width={100} height={50} />
            </div>
        </section>
    )
}