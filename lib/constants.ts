import type { DeliveryZone, TimeSlot } from '@/types';

export const site = {
  name: 'Pétalo',
  tagline: 'Florería de autor',
  city: 'Cochabamba',
  country: 'Bolivia',
  countryCode: 'BO',
  locale: 'es-BO',
  timezone: 'America/La_Paz',
  currency: 'BOB',
  currencySymbol: 'Bs',
  description:
    'Arreglos florales de autor con entrega el mismo día en Cochabamba. Flores frescas de corte, diseño contemporáneo y atención por WhatsApp.',
  url: 'https://petalo.bo',
  whatsapp: '+591 74309070',
  whatsappRaw: '+59174309070',
  phone: '+591 4 453 2109',
  email: 'hola@petalo.bo',
  address: 'Av. Ballivián #745, Cala Cala, Cochabamba',
  hours: 'Lunes a sábado · 09:00 a 20:00',
  founded: 2019,
  social: {
    instagram: 'https://instagram.com/petalo.bo',
    pinterest: 'https://pinterest.com/petalo.bo',
    facebook: 'https://facebook.com/petalo.bo'
  }
};

export const deliveryZones: DeliveryZone[] = [
  { id: 'centro', name: 'Cochabamba centro', eta: '2 – 3 h', fee: 15, freeFrom: 280 },
  { id: 'norte', name: 'Zona norte · Cala Cala, Tiquipaya', eta: '2 – 4 h', fee: 20, freeFrom: 350 },
  { id: 'sur', name: 'Zona sur · Queru Queru, Colcapirhua', eta: '3 – 4 h', fee: 25, freeFrom: 380 },
  { id: 'sacaba', name: 'Sacaba', eta: '4 – 5 h', fee: 35, freeFrom: 480 },
  { id: 'quillacollo', name: 'Quillacollo · Vinto · Sipe Sipe', eta: '4 – 5 h', fee: 40, freeFrom: 520 }
];

export const timeSlots: TimeSlot[] = [
  { id: '10-12', label: '10:00 – 12:00', start: '10:00', end: '12:00' },
  { id: '12-14', label: '12:00 – 14:00', start: '12:00', end: '14:00' },
  { id: '14-16', label: '14:00 – 16:00', start: '14:00', end: '16:00' },
  { id: '16-18', label: '16:00 – 18:00', start: '16:00', end: '18:00' },
  { id: '18-20', label: '18:00 – 20:00', start: '18:00', end: '20:00' }
];

export const priceRange = { min: 120, max: 1200 };

export const navLinks = [
  { href: '/coleccion', label: 'Enviar hoy' },
  { href: '/coleccion?occasion=cumpleanos', label: 'Por ocasión' },
  { href: '/coleccion', label: 'Colección' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/nosotros', label: 'Nosotros' }
];

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsappRaw.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
