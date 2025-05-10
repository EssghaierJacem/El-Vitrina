import { ComponentFixture, TestBed } from '@angular/core/testing';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

import { CommentEditComponent } from './comment-edit.component';

describe('CommentEditComponent', () => {
  let component: CommentEditComponent;
  let fixture: ComponentFixture<CommentEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({imports: [CommentEditComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]})
    .compileComponents();

    fixture = TestBed.createComponent(CommentEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
