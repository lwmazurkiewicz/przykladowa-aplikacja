import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of, switchMap } from 'rxjs';
import { MathService } from '../api/math.service';
import { Category } from '../api/Category';


@Component({
  selector: 'app-theorem-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './theorem-form.html'
})
export class TheoremFormComponent {

  theoremId?: number;

  categories = signal<Category[]>([]);

  readonly theoremTypes = [
    'DEFINITION',
    'THEOREM',
    'LEMMA',
    'AXIOM'
  ];

  form: FormGroup;

  get categoriesFormArray(): FormArray<FormControl<boolean>> {
    return this.form.get('categories') as FormArray;
  }

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private mathService: MathService) {

    this.form = this.formBuilder.nonNullable.group({
      type: ['DEFINITION', Validators.required],
      name: ['', Validators.required],
      statement: ['', Validators.required],
      categories: this.formBuilder.array<FormControl<boolean>>([])
    });

    this.theoremId = Number(this.route.snapshot.paramMap.get('id'));
    const categories$ = this.mathService.getCategories();
    this.route.paramMap.pipe(
      switchMap(params => params.has('id') ? forkJoin({
        categories: categories$,
        theorem: this.mathService.getTheorem(Number(params.get('id')))
      }) : forkJoin({ categories: categories$, theorem: of(null) }))
    ).subscribe(result => {
      this.categories.set(result.categories);

      result.categories.forEach(() => {
        this.categoriesFormArray.push(this.formBuilder.nonNullable.control(false));
      });

      if (result.theorem) {
        this.form.patchValue({
          type: result.theorem.type,
          name: result.theorem.name,
          statement: result.theorem.statement,
          categories: result.categories.map((category) => (result.theorem.categories || []).includes(category.id))
        });
      }
    });
  }

  toggleCategory(categoryId: number, checked: boolean): void {
    const current = this.form.get('categories')?.value;

    if (checked) {
      this.form.get('categories')?.setValue([
        ...current,
        categoryId
      ]);
    } else {
      this.form.get('categories')?.setValue(
        current.filter((id: any) => id !== categoryId)
      );
    }
  }

  isSelected(categoryId: number): boolean {
    return this.form.get('categories')?.value.includes(categoryId);
  }

  save(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const theorem = this.form.getRawValue();
    theorem.categories = this.categoriesFormArray.value
      .map((checked, index) =>
        checked ? this.categories()[index].id : null
      )
      .filter((id): id is number => id !== null);

    const request = this.theoremId
      ? this.mathService.updateTheorem(this.theoremId, theorem)
      : this.mathService.createTheorem(theorem);

    request.subscribe(() => {
      this.router.navigate(['/math']);
    });
  }
}