import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { RatingStars } from '@/components/ui/RatingStars';
import { reviews, averageRating } from '@/lib/reviews';
import { occasionBySlug } from '@/lib/occasions';

export function Reviews() {
  if (!reviews.length) return null;
  const featured = reviews.slice(0, 4);
  return (
    <section className="bg-ivory/40 py-section md:py-section-md">
      <Container>
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-end mb-10 md:mb-14">
          <div className="lg:col-span-7">
            <SectionTitle
              eyebrow="Lo que dicen"
              title="Experiencias de nuestros clientes."
              description="Testimonios compartidos con autorización."
            />
          </div>
          <div className="lg:col-span-5 flex items-center gap-4 lg:justify-end">
            <div>
              <p className="font-serif text-5xl text-forest">{averageRating.toFixed(1)}</p>
              <RatingStars value={averageRating} showValue={false} />
              <p className="text-xs text-muted mt-1">Basado en {reviews.length} testimonios</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {featured.map((r) => {
            const occ = r.occasion !== 'otro' ? occasionBySlug(r.occasion) : null;
            return (
              <article key={r._id} className="bg-cream p-7 md:p-8 rounded-sm shadow-soft flex flex-col gap-4">
                <RatingStars value={r.rating} />
                <blockquote className="font-serif text-lg md:text-xl leading-snug text-forest text-pretty">
                  "{r.text}"
                </blockquote>
                <div className="flex items-center justify-between mt-2 pt-4 border-t border-line">
                  <div>
                    <p className="text-sm text-forest">{r.name}</p>
                    <p className="text-xs text-muted">{r.city}</p>
                  </div>
                  {occ && (
                    <span className="text-[10px] uppercase tracking-wider text-clay">
                      {occ.name}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
