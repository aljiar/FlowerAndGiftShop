import type { Metadata } from 'next';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
  description: 'Finaliza tu pedido de flores en Cochabamba.'
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
