import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyRentReportComponent } from './monthly-rent-report.component';

describe('MonthlyRentReportComponent', () => {
  let component: MonthlyRentReportComponent;
  let fixture: ComponentFixture<MonthlyRentReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthlyRentReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyRentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
