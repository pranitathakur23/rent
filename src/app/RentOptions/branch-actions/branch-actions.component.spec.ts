import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchActionsComponent } from './branch-actions.component';

describe('BranchActionsComponent', () => {
  let component: BranchActionsComponent;
  let fixture: ComponentFixture<BranchActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
