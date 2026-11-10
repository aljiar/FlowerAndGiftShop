import type { Review } from '@/types';
// Añadir únicamente testimonios reales cuya publicación haya sido autorizada.
export const reviews: Review[] = [];
export const averageRating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
