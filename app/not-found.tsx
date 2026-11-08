import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export default function NotFound() {
  return (
    <Container className="py-section text-center">
      <p className="font-serif text-7xl md:text-8xl text-clay">404</p>
      <h1 className="font-serif text-2xl md:text-3xl mt-4 mb-2">Esta flor no está en nuestro taller</h1>
      <p className="text-muted">La página que buscás no existe o fue movida.</p>
      <Link href="/" className="inline-block mt-8 underline text-forest hover:text-clay">
        Volver al inicio
      </Link>
    </Container>
  );
}
