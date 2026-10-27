import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathHome } from './math-home';

describe('MathHome', () => {
  let component: MathHome;
  let fixture: ComponentFixture<MathHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathHome],
    }).compileComponents();

    fixture = TestBed.createComponent(MathHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
