import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtrUploadComponent } from './utr-upload.component';

describe('UtrUploadComponent', () => {
  let component: UtrUploadComponent;
  let fixture: ComponentFixture<UtrUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtrUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtrUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
