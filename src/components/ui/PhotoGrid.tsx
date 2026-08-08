import { cn } from '@/lib/utils';
import { PhotoCard, type PhotoCardProps } from './PhotoCard';

export function PhotoGrid({ items, cols = 3 }: { items: PhotoCardProps[]; cols?: 2 | 3 }) {
  return (
    <div
      className={cn(
        'grid gap-4 sm:grid-cols-2 sm:gap-6',
        cols === 3 && 'lg:grid-cols-3',
      )}
    >
      {items.map((item, i) => (
        <PhotoCard key={item.src} {...item} index={i} />
      ))}
    </div>
  );
}
