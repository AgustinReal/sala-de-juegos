import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgistroComponent } from './resgistro.component';

describe('ResgistroComponent', () => {
  let component: ResgistroComponent;
  let fixture: ComponentFixture<ResgistroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResgistroComponent]
    });
    fixture = TestBed.createComponent(ResgistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
