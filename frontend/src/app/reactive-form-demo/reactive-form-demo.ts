import { Component, OnInit, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { JsonPipe } from '@angular/common';

function forbiddenNameValidator(): ValidatorFn {
  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value = control.value?.toLowerCase() ?? '';

    return value === 'admin'
      ? { forbiddenName: true }
      : null;
  };
}

@Component({
  selector: 'app-reactive-form-demo',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './reactive-form-demo.html'
})
export class ReactiveFormDemoComponent {

  private fb = inject(FormBuilder);

  readonly strength = signal('Słabe');

  readonly form = this.fb.nonNullable.group({
    login: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        forbiddenNameValidator()
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/.*[A-Z].*/)
      ]
    ]
  });

  constructor(private readonly formBuilder: FormBuilder) {

    this.form.controls.password.valueChanges.subscribe(
      password => {

        if (password.length < 8) {
          this.strength.set('Słabe');
        }
        else if (password.length < 12) {
          this.strength.set('Średnie');
        }
        else {
          this.strength.set('Silne');
        }

      }
    );

    this.form.valueChanges.subscribe(value => {
      console.log('Nowa wartość formularza:', value);
    });
  }

  save(): void {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.getRawValue());
  }
}