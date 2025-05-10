import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { BlogPostDetailsComponent } from './blog-post-details.component';

describe('BlogPostDetailsComponent', () => {
  let component: BlogPostDetailsComponent;
  let fixture: ComponentFixture<BlogPostDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [BlogPostDetailsComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostDetailsComponent);
    component = fixture.componentInstance;
    
    // Provide mock data before detecting changes
    component.blogPost = {
      id: 1,
      title: 'Test Blog Post',
      content: 'Test Content',
      createdAt: new Date().toISOString(),
      image: '',
      tag: 'test',
      user: { id: 1, firstname: 'Test User', email: 'test@example.com' },
      reactionNumber: 0
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
