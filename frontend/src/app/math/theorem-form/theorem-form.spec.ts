import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TheoremFormComponent } from './theorem-form';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { MathService } from '../api/math.service';
import { Theorem } from '../api/Theorem';

describe('TheoremForm', () => {
  const THEOREM_ID = 12;
  let mathService: MathService;
  let component: TheoremFormComponent;
  let fixture: ComponentFixture<TheoremFormComponent>;

  beforeEach(async () => {
    const activatedRoute = {
      snapshot: {
        paramMap: convertToParamMap({
          id: THEOREM_ID
        })
      },
      paramMap: of(convertToParamMap({
        id: THEOREM_ID
      }))
    }
    mathService = {
      getCategories: vi.fn(() => of([{ id: 1, name: 'Logika' }, { id: 2, name: 'Analiza' }])),
      getTheorem: vi.fn(() => of({ id: THEOREM_ID, type: 'THEOREM', name: 'nazwa', statement: 'treść' } as Theorem))
    } as any as MathService;
    await TestBed.configureTestingModule({
      imports: [TheoremFormComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute },
      { provide: Router, useValue: { navigate: () => { } } },
      { provide: MathService, useValue: mathService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TheoremFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mathService.getCategories).toHaveBeenCalled();
  });

  it('should edit statement form after input change', () => {
    const textarea = fixture.nativeElement.querySelector('#statement');
    textarea.value = 'Nowa treść';
    textarea.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.form.controls['statement'].value).toEqual('Nowa treść');
  });
});
