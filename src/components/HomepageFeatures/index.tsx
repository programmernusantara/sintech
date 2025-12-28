import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  image: string; // Ganti dari Svg → image
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Mobile App',
    image: require('@site/static/img/mobile_developer.png').default,
    description: (
      <>
        Belajar membuat aplikasi modern dari awal menggunakan Dart & Flutter. Bangun UI elegan, sistem terhubung ke backend, hingga aplikasi siap rilis.
      </>
    ),
  },
  {
    title: 'Internet of Things',
    image: require('@site/static/img/internet_of_things.png').default,
    description: (
      <>
        Kuasai dunia IoT dengan Arduino dan Raspberry Pi. Rancang perangkat pintar, automasi, dan sistem berbasis sensor dengan mudah.
      </>
    ),
  },
  {
    title: 'AI & Machine Learning',
    image: require('@site/static/img/artificial_intellegence.png').default,
    description: (
      <>
        Pelajari konsep kecerdasan buatan, machine learning, dan cara membangun model AI yang dapat diintegrasikan langsung ke aplikasi Anda.
      </>
    ),
  },
];

function Feature({ title, image, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <div className={styles.iconBox}>
          <img src={image} alt={title} className={styles.featureImg} />
        </div>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}