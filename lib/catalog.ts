import type { Product } from '@/types';

const u = (id: string, alt: string) => ({
  url: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1400&q=80`,
  alt
});

export const products: Product[] = [
  {
    _id: 'p-001',
    slug: 'jardin-en-rosa',
    name: 'Jardín en rosa',
    shortDescription:
      'Rosas garden y peonías rosadas en composición suelta, acabadas con eucalyptus.',
    longDescription:
      'Un arreglo que respira. Rosas garden de tallo largo se entrelazan con peonías recién abiertas y ramas de eucalyptus parvifolia. La paleta monocromática —del blush al carmín— dialoga con follaje plateado y una base de cerámica crema que puede personalizarse.',
    basePrice: 380,
    compareAtPrice: 420,
    images: [
      u('photo-1561181286-d3fee7d55364', 'Arreglo de rosas rosadas y peonías en cerámica'),
      u('photo-1487530811176-3780de880c2d', 'Detalle de peonías abiertas y eucalyptus'),
      u('photo-1490750967868-88aa4486c946', 'Arreglo completo sobre mesa editorial'),
      u('photo-1469259943454-aa100abba749', 'Vista lateral con luz natural')
    ],
    flowers: ['rosas', 'peonias'],
    occasions: ['amor', 'aniversario', 'cumpleanos'],
    variants: [
      { id: 'jr-s', size: 'S', label: 'Chico · 12 tallos', priceDelta: -80 },
      { id: 'jr-m', size: 'M', label: 'Mediano · 20 tallos', priceDelta: 0 },
      { id: 'jr-l', size: 'L', label: 'Grande · 32 tallos', priceDelta: 160 }
    ],
    inStock: true,
    tags: ['best'],
    highlights: ['Hecho a mano en taller', 'Cerámica reutilizable', 'Tarjeta personalizada'],
    care: 'Cambia el agua cada 24 h y mantén el arreglo lejos de la luz directa.'
  },
  {
    _id: 'p-002',
    slug: 'amanecer-silvestre',
    name: 'Amanecer silvestre',
    shortDescription:
      'Tulipanes, anémonas y ramas de manzano en bouquet de estilo europeo.',
    longDescription:
      'Inspirado en los ramos que se encuentran en los mercados de Ámsterdam. Tulipanes en tres tonos, anémonas oscuras y ramas jóvenes de manzano en flor. Diseño asimétrico, sin espuma floral.',
    basePrice: 320,
    images: [
      u('photo-1525310072745-f49212b5ac6d', 'Bouquet de tulipanes y anémonas'),
      u('photo-1487070183336-b863922373d4', 'Ramo envuelto en papel kraft')
    ],
    flowers: ['tulipanes', 'wildflowers'],
    occasions: ['cumpleanos', 'agradecimientos', 'amor'],
    variants: [
      { id: 'as-s', size: 'S', label: 'Chico · 10 tallos', priceDelta: -60 },
      { id: 'as-m', size: 'M', label: 'Mediano · 18 tallos', priceDelta: 0 },
      { id: 'as-l', size: 'L', label: 'Grande · 28 tallos', priceDelta: 140 }
    ],
    inStock: true,
    tags: ['nuevo']
  },
  {
    _id: 'p-003',
    slug: 'hortensia-de-luz',
    name: 'Hortensia de luz',
    shortDescription:
      'Una sola hortensia blanca en jarrón bajo de barro cocido, ideal para escritorios.',
    longDescription:
      'Una pieza escultural. Una hortensia blanca de cabeza grande acompañada de tres tallos delgados de rusco. Pensada para regalar en momentos importantes que no necesitan estridencia.',
    basePrice: 220,
    images: [
      u('photo-1487070183336-b863922373d4', 'Referencia de flores en tonos claros')
    ],
    flowers: ['hortensias'],
    occasions: ['condolencias', 'agradecimientos'],
    variants: [
      { id: 'hl-m', size: 'M', label: 'Único', priceDelta: 0 }
    ],
    inStock: true,
    tags: ['edicion-limitada']
  },
  {
    _id: 'p-004',
    slug: 'sol-de-enero',
    name: 'Sol de enero',
    shortDescription: 'Girasoles, solidago y hojas de palmera en canasta de mimbre.',
    longDescription:
      'Para cuando un gesto amplio es el mensaje. Girasoles de campo, solidago amarillo y hojas frescas de palmera trenzadas a mano. Una composición que llena una habitación.',
    basePrice: 290,
    images: [
      u('photo-1455659817273-f96807779a8a', 'Referencia de girasoles amarillos')
    ],
    flowers: ['girasoles', 'wildflowers'],
    occasions: ['cumpleanos', 'agradecimientos', 'nacimientos'],
    variants: [
      { id: 'se-s', size: 'S', label: 'Chico · 6 girasoles', priceDelta: -70 },
      { id: 'se-m', size: 'M', label: 'Mediano · 12 girasoles', priceDelta: 0 },
      { id: 'se-l', size: 'L', label: 'Grande · 20 girasoles', priceDelta: 130 }
    ],
    inStock: true,
    tags: ['best']
  },
  {
    _id: 'p-005',
    slug: 'silencio-blanco',
    name: 'Silencio blanco',
    shortDescription:
      'Lilis blancos, astilbe y olivo para acompañar condolencias con respeto.',
    longDescription:
      'Un arreglo discreto y profundo. Lilis blancos orientales en botón, astilbe crema y ramas de olivo. Diseñado en conjunto con familias que necesitan transmitir presencia sin palabras.',
    basePrice: 360,
    images: [
      u('photo-1519378058457-4c29a0a2efac', 'Referencia floral blanca para ceremonia')
    ],
    flowers: ['lilis', 'wildflowers'],
    occasions: ['condolencias'],
    variants: [
      { id: 'sb-m', size: 'M', label: 'Mediano', priceDelta: 0 },
      { id: 'sb-l', size: 'L', label: 'Grande', priceDelta: 120 }
    ],
    inStock: true,
    tags: []
  },
  {
    _id: 'p-006',
    slug: 'capullo',
    name: 'Capullo',
    shortDescription:
      'Suculentas y tillandsias en caja de madera reciclada. Un regalo que dura.',
    longDescription:
      'Para bebés, cumpleañeras o detalles corporativos. Cinco suculentas y dos tillandsias en una caja de madera reciclada de Cochabamba. Incluye instructivo de cuidado.',
    basePrice: 180,
    images: [
      u('photo-1485955900006-10f4d324d411', 'Suculentas en caja de madera'),
      u('photo-1459411552884-841db9b3cc2a', 'Detalle de tillandsias')
    ],
    flowers: ['suculentas'],
    occasions: ['nacimientos', 'corporativo'],
    variants: [
      { id: 'ca-m', size: 'M', label: 'Caja mediana', priceDelta: 0 }
    ],
    inStock: true,
    tags: ['sale']
  },
  {
    _id: 'p-007',
    slug: 'sereno',
    name: 'Sereno',
    shortDescription:
      'Lavanda, romero y statice en bouquet aromático para acompañar una cena.',
    longDescription:
      'Un bouquet que huele a jardín. Lavanda fresca, romero recién cortado y statice malva. Ideal para regalar a quien ama cocinar o leer junto a una ventana.',
    basePrice: 240,
    images: [
      u('photo-1468327768560-75b778cbb551', 'Bouquet de lavanda y romero'),
      u('photo-1455659817273-f96807779a8a', 'Detalle aromático')
    ],
    flowers: ['lavanda', 'wildflowers'],
    occasions: ['agradecimientos', 'cumpleanos'],
    variants: [
      { id: 'sr-m', size: 'M', label: 'Mediano', priceDelta: 0 },
      { id: 'sr-l', size: 'L', label: 'Grande', priceDelta: 90 }
    ],
    inStock: true,
    tags: []
  },
  {
    _id: 'p-008',
    slug: 'poema',
    name: 'Poema',
    shortDescription:
      'Bouquet editorial de rosas rojas, ramificada y envuelta en papel washi.',
    longDescription:
      'Rosas rojas de tallo largo acompañadas de ramita de mirto y paniculata. Envuelto en papel washi color marfil con sello de cera. Para decir lo importante sin escribir demasiado.',
    basePrice: 340,
    images: [
      u('photo-1561181286-d3fee7d55364', 'Rosas rojas envueltas'),
      u('photo-1525310072745-f49212b5ac6d', 'Detalle del sello')
    ],
    flowers: ['rosas'],
    occasions: ['amor', 'aniversario'],
    variants: [
      { id: 'po-s', size: 'S', label: 'Chico · 12 rosas', priceDelta: -100 },
      { id: 'po-m', size: 'M', label: 'Mediano · 24 rosas', priceDelta: 0 },
      { id: 'po-l', size: 'L', label: 'Grande · 50 rosas', priceDelta: 240 }
    ],
    inStock: true,
    tags: ['best']
  },
  {
    _id: 'p-009',
    slug: 'luna-de-agosto',
    name: 'Luna de agosto',
    shortDescription:
      'Proteas, banksias y eucalyptus en arreglo de estilo sudafricano.',
    longDescription:
      'Para quienes aman lo distinto. Protea rey, banksia coccínea y eucalyptus gunnii en una composición de líneas fuertes y texturas inesperadas.',
    basePrice: 480,
    images: [
      u('photo-1487530811176-3780de880c2d', 'Protea y banksia en arreglo'),
      u('photo-1490750967868-88aa4486c946', 'Vista lateral con texturas')
    ],
    flowers: ['exoticas', 'wildflowers'],
    occasions: ['aniversario', 'corporativo'],
    variants: [
      { id: 'la-m', size: 'M', label: 'Mediano', priceDelta: 0 },
      { id: 'la-l', size: 'L', label: 'Grande', priceDelta: 160 }
    ],
    inStock: true,
    tags: ['edicion-limitada']
  },
  {
    _id: 'p-010',
    slug: 'alba',
    name: 'Alba',
    shortDescription:
      'Peonías blancas, rosa blanca y jazmín en composición de novia.',
    longDescription:
      "Un bouquet pensado para bodas de día. Peonías blancas lactescadas, rosa blanca «Whita O'Hara» y jazmín de noche. Diseño sin ataduras visibles para que la silueta fluya.",
    basePrice: 560,
    images: [
      u('photo-1519378058457-4c29a0a2efac', 'Bouquet de novia en peonías blancas')
    ],
    flowers: ['peonias', 'rosas'],
    occasions: ['amor'],
    variants: [
      { id: 'al-m', size: 'M', label: 'Mediano', priceDelta: 0 },
      { id: 'al-l', size: 'L', label: 'Grande', priceDelta: 180 }
    ],
    inStock: true,
    tags: ['nuevo']
  },
  {
    _id: 'p-011',
    slug: 'mesa-larga',
    name: 'Mesa larga',
    shortDescription:
      'Centro de mesa bajo con hortensias, velas y romero para eventos.',
    longDescription:
      'Diseñado para mesas largas de celebración. Hortensias en tonos crema y rosa empolvado, velas de soja aromáticas y romero fresco. Bajo perfil para no obstruir la conversación.',
    basePrice: 720,
    images: [
      u('photo-1487530811176-3780de880c2d', 'Referencia de composición floral para mesa'),
      u('photo-1487070183336-b863922373d4', 'Mesa editorial lista')
    ],
    flowers: ['hortensias', 'lavanda'],
    occasions: ['corporativo', 'aniversario'],
    variants: [
      { id: 'ml-m', size: 'M', label: '1.20 m', priceDelta: 0 },
      { id: 'ml-l', size: 'L', label: '2.00 m', priceDelta: 360 }
    ],
    inStock: true,
    tags: []
  },
  {
    _id: 'p-012',
    slug: 'detalle-suave',
    name: 'Detalle suave',
    shortDescription:
      'Rosas en miniatura y paniculata en cajita de regalo. Para detalles corporativos.',
    longDescription:
      'Una cajita de madera reciclada con seis rosas en miniatura y paniculata. Perfecta como detalle corporativo, bienvenida de hoteles o agradecimiento a equipos pequeños.',
    basePrice: 140,
    images: [
      u('photo-1455659817273-f96807779a8a', 'Cajita con rosas mini'),
      u('photo-1468327768560-75b778cbb551', 'Detalle corporativo')
    ],
    flowers: ['rosas'],
    occasions: ['corporativo', 'agradecimientos'],
    variants: [
      { id: 'ds-m', size: 'M', label: 'Cajita individual', priceDelta: 0 },
      { id: 'ds-l', size: 'L', label: 'Set de 5 cajitas', priceDelta: 480 }
    ],
    inStock: true,
    tags: ['sale']
  }
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getProductsByOccasion = (slug: string) =>
  products.filter((p) => p.occasions.includes(slug as Product['occasions'][number]));

export const getProductsByFlower = (flower: string) =>
  products.filter((p) => p.flowers.includes(flower as Product['flowers'][number]));

export const featuredProducts = products
  .filter((p) => p.tags.includes('best') || p.tags.includes('nuevo'))
  .slice(0, 8);

export const productPriceRange = (p: Product) => {
  const min = Math.min(...p.variants.map((v) => p.basePrice + v.priceDelta));
  const max = Math.max(...p.variants.map((v) => p.basePrice + v.priceDelta));
  return { min, max };
};
