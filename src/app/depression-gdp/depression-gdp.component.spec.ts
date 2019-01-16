import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepressionGdpComponent } from './depression-gdp.component';

describe('DepressionGdpComponent', () => {
  let component: DepressionGdpComponent;
  let fixture: ComponentFixture<DepressionGdpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepressionGdpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepressionGdpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
