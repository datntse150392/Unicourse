import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetailPageComponent } from './blog-detail-page.component';

describe('BlogDetailPageComponent', () => {
  let component: BlogDetailPageComponent;
  let fixture: ComponentFixture<BlogDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogDetailPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
