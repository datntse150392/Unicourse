import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRelatedCourseComponent } from './list-related-course.component';

describe('ListRelatedCourseComponent', () => {
  let component: ListRelatedCourseComponent;
  let fixture: ComponentFixture<ListRelatedCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRelatedCourseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListRelatedCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
