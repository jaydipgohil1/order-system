import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IDialogComponent } from './i-dialog.component';

describe('IDialogComponent', () => {
  let component: IDialogComponent;
  let fixture: ComponentFixture<IDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IDialogComponent]
    });
    fixture = TestBed.createComponent(IDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
