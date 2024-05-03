import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardResultPageComponent } from './flashcard-result-page.component';

describe('FlashcardResultPageComponent', () => {
  let component: FlashcardResultPageComponent;
  let fixture: ComponentFixture<FlashcardResultPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardResultPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FlashcardResultPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
