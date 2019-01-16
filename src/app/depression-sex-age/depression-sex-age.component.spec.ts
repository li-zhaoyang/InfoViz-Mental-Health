import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepressionSexAgeComponent } from './depression-sex-age.component';

describe('DepressionSexAgeComponent', () => {
  let component: DepressionSexAgeComponent;
  let fixture: ComponentFixture<DepressionSexAgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepressionSexAgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepressionSexAgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
