import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisparosComponent } from './disparos.component';

describe('DisparosComponent', () => {
  let component: DisparosComponent;
  let fixture: ComponentFixture<DisparosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisparosComponent]
    });
    fixture = TestBed.createComponent(DisparosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
