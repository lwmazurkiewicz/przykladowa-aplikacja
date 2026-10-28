import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'theoremType',
  standalone: true
})
export class TheoremTypePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'THEOREM':
        return 'Twierdzenie';

      case 'DEFINITION':
        return 'Definicja';

      case 'LEMMA':
        return 'Lemat';

      case 'AXIOM':
        return 'Aksjomat';

      default:
        return value;
    }
  }

}