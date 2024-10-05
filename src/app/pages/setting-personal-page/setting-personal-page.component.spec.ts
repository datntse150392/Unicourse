import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingPersonalPageComponent } from './setting-personal-page.component';

describe('SettingPersonalPageComponent', () => {
  let component: SettingPersonalPageComponent;
  let fixture: ComponentFixture<SettingPersonalPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingPersonalPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SettingPersonalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
