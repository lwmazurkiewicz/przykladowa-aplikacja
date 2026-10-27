import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryTheorems } from './category-theorems';

describe('CategoryTheorems', () => {
  let component: CategoryTheorems;
  let fixture: ComponentFixture<CategoryTheorems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTheorems],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryTheorems);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
