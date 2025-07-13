// lib/helpers/sortSubjects.ts

import { CombinedItem } from '../dTypes/resultTypes';

export const sortSubjects = (items: CombinedItem[], order: string[]): CombinedItem[] => {
  const sifItem = items.find(i => i.type === 'SIF');
  const marks = items.filter(i => i.type === 'MARK');

  const sortedMarks = marks.sort((a, b) => {
    const idxA = order.indexOf(a.data.sc);
    const idxB = order.indexOf(b.data.sc);

    if (idxA === -1 && idxB === -1) {
      return a.data.sc.localeCompare(b.data.sc);
    }
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return sifItem ? [sifItem, ...sortedMarks] : sortedMarks;
};
