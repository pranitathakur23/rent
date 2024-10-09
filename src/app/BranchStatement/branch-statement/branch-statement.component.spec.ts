import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchStatementComponent } from './branch-statement.component';

describe('BranchStatementComponent', () => {
  let component: BranchStatementComponent;
  let fixture: ComponentFixture<BranchStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchStatementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BranchStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
