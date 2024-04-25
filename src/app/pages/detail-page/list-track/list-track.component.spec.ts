import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrackComponent } from './list-track.component';

describe('ListTrackComponent', () => {
  let component: ListTrackComponent;
  let fixture: ComponentFixture<ListTrackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListTrackComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
