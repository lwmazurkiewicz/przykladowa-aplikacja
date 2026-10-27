import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheoremForm } from './theorem-form';

describe('TheoremForm', () => {
  let component: TheoremForm;
  let fixture: ComponentFixture<TheoremForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheoremForm],
    }).compileComponents();

    fixture = TestBed.createComponent(TheoremForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
