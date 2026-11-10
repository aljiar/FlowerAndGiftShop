import { getProductsByOccasion, productPriceRange } from './catalog';
import type { Occasion } from '@/types';

const occasionData: Occasion[] = [
  {
    _id: 'o-1',
    slug: 'cumpleanos',
    name: 'Cumpleaños',
    blurb:
      'Para celebrar a quien quieres. Diseñamos arreglos que llenan una mesa y dicen todo por ti.',
    coverImage:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Mesa editorial decorada para cumpleaños',
    startingPrice: 220
  },
  {
    _id: 'o-2',
    slug: 'amor',
    name: 'Amor',
    blurb:
      'Bouquets que se eligen con cuidado. Rosas, peonías y texturas pensadas para enamorar.',
    coverImage:
      'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Bouquet romántico con rosas y peonías',
    startingPrice: 320
  },
  {
    _id: 'o-3',
    slug: 'agradecimientos',
    name: 'Agradecimientos',
    blurb:
      'Para decir gracias con algo que vive varios días. Diseñamos con flores de estación.',
    coverImage:
      'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Arreglo suave de agradecimientos',
    startingPrice: 180
  },
  {
    _id: 'o-4',
    slug: 'condolencias',
    name: 'Condolencias',
    blurb:
      'Ideas de composiciones sobrias, en tonos blancos y verdes. Consulta disponibilidad y fecha de entrega.',
    coverImage:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Arreglo blanco y verde para condolencias',
    startingPrice: 260
  },
  {
    _id: 'o-5',
    slug: 'nacimientos',
    name: 'Nacimientos',
    blurb:
      'Para recibir a alguien nuevo. Colores suaves, cajas durables y envíos a clínicas y casas.',
    coverImage:
      'https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Arreglo delicado para nacimiento',
    startingPrice: 200
  },
  {
    _id: 'o-6',
    slug: 'corporativo',
    name: 'Corporativo',
    blurb:
      'Ideas para recepciones, oficinas y regalos empresariales. Consulta opciones y condiciones.',
    coverImage:
      'https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=1600&q=80',
    coverAlt: 'Centro de mesa corporativo',
    startingPrice: 140
  }
];

export const occasions: Occasion[] = occasionData.map(occasion => {
  const samples = getProductsByOccasion(occasion.slug);
  return { ...occasion, startingPrice: samples.length ? Math.min(...samples.map(product => productPriceRange(product).min)) : occasion.startingPrice };
});

export const occasionBySlug = (slug: string) =>
  occasions.find((o) => o.slug === slug);
