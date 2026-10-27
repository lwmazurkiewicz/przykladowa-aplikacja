export interface Theorem {
  id: number;
  type: 'DEFINITION' | 'THEOREM' | 'LEMMA' | 'AXIOM';
  name: string;
  statement: string;
  categories?: number[];
}