import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyOfferComponent } from './apply-offer.component';

describe('ApplyOfferComponent', () => {
  let component: ApplyOfferComponent;
  let fixture: ComponentFixture<ApplyOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplyOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
