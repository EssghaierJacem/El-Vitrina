import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { BlogPostCreateComponent } from './blog-post-create.component';

describe('BlogPostCreateComponent', () => {
  let component: BlogPostCreateComponent;
  let fixture: ComponentFixture<BlogPostCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [BlogPostCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(BlogPostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
