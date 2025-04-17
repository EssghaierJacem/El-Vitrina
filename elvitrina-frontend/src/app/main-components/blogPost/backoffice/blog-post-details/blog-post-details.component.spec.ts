import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogPostDetailsComponent } from './blog-post-details.component';

describe('BlogPostDetailsComponent', () => {
  let component: BlogPostDetailsComponent;
  let fixture: ComponentFixture<BlogPostDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogPostDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
