import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { CommentCreateComponent } from './comment-create.component';

describe('CommentCreateComponent', () => {
  let component: CommentCreateComponent;
  let fixture: ComponentFixture<CommentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [CommentCreateComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(CommentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
