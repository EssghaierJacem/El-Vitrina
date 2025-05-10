import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreListComponent } from './store-list.component';
import { COMMON_TEST_CONFIG } from 'src/app/testing/test-utils';

describe('StoreListComponent', () => {
  let component: StoreListComponent;
  let fixture: ComponentFixture<StoreListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreListComponent, ...COMMON_TEST_CONFIG.imports],
      providers: [...COMMON_TEST_CONFIG.providers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
