import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinBankingComponent } from './coin-banking.component';

describe('CoinBankingComponent', () => {
  let component: CoinBankingComponent;
  let fixture: ComponentFixture<CoinBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoinBankingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CoinBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
