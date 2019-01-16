import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuicideSexScatterComponent } from './suicide-sex-scatter.component';

describe('SuicideSexScatterComponent', () => {
  let component: SuicideSexScatterComponent;
  let fixture: ComponentFixture<SuicideSexScatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuicideSexScatterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuicideSexScatterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
