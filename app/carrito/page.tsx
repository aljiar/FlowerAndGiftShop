import type { Metadata } from 'next';
import { CartPage } from '@/components/checkout/CartPage';

export const metadata: Metadata = {
  title: 'Tu carrito'
};

export default function Page() {
  return <CartPage />;
}
