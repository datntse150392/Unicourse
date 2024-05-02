import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardDetailPageComponent } from './flashcard-detail-page.component';

describe('FlashcardDetailPageComponent', () => {
  let component: FlashcardDetailPageComponent;
  let fixture: ComponentFixture<FlashcardDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardDetailPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlashcardDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
