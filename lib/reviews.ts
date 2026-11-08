import type { Review } from '@/types';

export const reviews: Review[] = [
  {
    _id: 'r-1',
    name: 'María Lucía M.',
    rating: 5,
    text:
      'Pedí el Jardín en rosa para mi mamá en su cumpleaños. Llegó dentro de la franja que pedí y el ramo era incluso más bonito que en la foto. La tarjeta estaba escrita a mano, eso me encantó.',
    occasion: 'cumpleanos',
    city: 'Cochabamba',
    date: '2026-06-12'
  },
  {
    _id: 'r-2',
    name: 'Andrés Q.',
    rating: 5,
    text:
      'Necesitaba condolencias para un funeral y me asesoraron por WhatsApp sin presionar. El arreglo Silencio blanco fue exactamente lo que esperábamos.',
    occasion: 'condolencias',
    city: 'Cochabamba',
    date: '2026-05-04'
  },
  {
    _id: 'r-3',
    name: 'Carolina P.',
    rating: 5,
    text:
      'Hicieron toda la floral de mi boda. Las peonías Alba estaban impecables y el equipo del día se adaptó a los cambios de último momento.',
    occasion: 'amor',
    city: 'Tiquipaya',
    date: '2026-04-18'
  },
  {
    _id: 'r-4',
    name: 'Javier S.',
    rating: 5,
    text:
      'Para el aniversario de la oficina encargué veinte cajitas Detalle suave. Llegaron puntuales y la factura salió perfecta. Volvemos a llamar.',
    occasion: 'corporativo',
    city: 'Cochabamba',
    date: '2026-03-30'
  },
  {
    _id: 'r-5',
    name: 'Daniela R.',
    rating: 4,
    text:
      'Pedí un ramo para mi mejor amiga en Sacaba y llegó antes de lo previsto. Tuve que llamar para confirmar la franja y todo bien.',
    occasion: 'amor',
    city: 'Sacaba',
    date: '2026-02-14'
  },
  {
    _id: 'r-6',
    name: 'Luis F.',
    rating: 5,
    text:
      'Las suculentas Capullo fueron un regalo perfecto para mi hermana que tuvo a su primera bebé. La caja es hermosa, la va a guardar.',
    occasion: 'nacimientos',
    city: 'Quillacollo',
    date: '2026-01-22'
  }
];

export const averageRating = (() => {
  const total = reviews.reduce((acc, r) => acc + r.rating, 0);
  return Number((total / reviews.length).toFixed(1));
})();
