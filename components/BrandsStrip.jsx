import styles from './BrandsStrip.module.css';
import Image from 'next/image';

export default function BrandsStrip() {
    return (
        <section className={styles.brend}>
            <div className={styles.brandsStrip}>
                {/* Перша група логотипів */}
                <div className={styles.logoGroup}>
                    <Image src="/ebay.svg" alt="Brand 1" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/amazon.svg" alt="Brand 2" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/AJIO.svg" alt="Brand 3" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/ebay.svg" alt="Brand 1" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/amazon.svg" alt="Brand 2" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/AJIO.svg" alt="Brand 3" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                </div>

                <div aria-hidden="true" className={styles.logoGroup}>
                    <Image src="/ebay.svg" alt="Brand 1" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/amazon.svg" alt="Brand 2" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/AJIO.svg" alt="Brand 3" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/ebay.svg" alt="Brand 1" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/amazon.svg" alt="Brand 2" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                    <Image src="/AJIO.svg" alt="Brand 3" width={100} height={50} style={{ objectFit: 'contain', width: 'auto', height: 'auto' }} />
                </div>
            </div>
        </section>
    );
}
