import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionHistoryPageComponent } from './transaction-history-page.component';

describe('TransactionHistoryPageComponent', () => {
  let component: TransactionHistoryPageComponent;
  let fixture: ComponentFixture<TransactionHistoryPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionHistoryPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionHistoryPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
