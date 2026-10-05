import type { Item, Items } from '@/hooks/fetch'

export const gelPen: Item = {
  id: 198,
  cost: 2.5,
  description: 'Smooth-flowing 0.5mm gel ink pen with a comfortable rubber grip.',
  title: 'Gel Pen',
  image: 'https://placehold.co/400x400/3B82F6/3B82F6.png',
  stockCount: 120,
}

export const stapler: Item = {
  id: 281,
  cost: 12,
  description: 'Heavy-duty desktop stapler.',
  title: 'Stapler',
  image: 'https://placehold.co/400x400/000000/000000.png',
  stockCount: 18,
}

export const washiTape: Item = {
  id: 295,
  cost: 5.5,
  description: 'Set of 4 decorative washi tape rolls, easy to tear and reposition.',
  title: 'Washi Tape',
  image: 'https://placehold.co/400x400/A855F7/A855F7.png',
  stockCount: 0,
}

export const items: Items = { gelPen, stapler, washiTape }
