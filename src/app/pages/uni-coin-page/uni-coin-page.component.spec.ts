import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniCoinPageComponent } from './uni-coin-page.component';

describe('UniCoinPageComponent', () => {
  let component: UniCoinPageComponent;
  let fixture: ComponentFixture<UniCoinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniCoinPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniCoinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
