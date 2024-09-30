import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceSystemComponent } from './maintenance-system.component';

describe('MaintenanceSystemComponent', () => {
  let component: MaintenanceSystemComponent;
  let fixture: ComponentFixture<MaintenanceSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaintenanceSystemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaintenanceSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
