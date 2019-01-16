import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeTypeComponent } from './age-type.component';

describe('AgeTypeComponent', () => {
  let component: AgeTypeComponent;
  let fixture: ComponentFixture<AgeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
