import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollInfoComponent } from './enroll-info.component';

describe('EnrollInfoComponent', () => {
  let component: EnrollInfoComponent;
  let fixture: ComponentFixture<EnrollInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnrollInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
