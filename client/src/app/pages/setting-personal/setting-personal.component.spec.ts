import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPersonalComponent } from './setting-personal.component';

describe('SettingPersonalComponent', () => {
  let component: SettingPersonalComponent;
  let fixture: ComponentFixture<SettingPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingPersonalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
