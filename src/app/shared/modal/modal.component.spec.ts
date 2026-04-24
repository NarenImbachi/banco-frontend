/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {

  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;

    jest.useFakeTimers(); 
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with showClass true if isOpen', () => {

    component.isOpen = true;
    component.ngOnInit();
    jest.advanceTimersByTime(50);

    expect(component.showClass).toBe(true);
  });

  it('should react to isOpen changes (open)', () => {

    component.isOpen = true;

    component.ngOnChanges({
      isOpen: {
        currentValue: true,
        previousValue: false,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    jest.advanceTimersByTime(50);

    expect(component.showClass).toBe(true);
  });

  it('should react to isOpen changes (close)', () => {

    component.showClass = true;
    component.isOpen = false;

    component.ngOnChanges({
      isOpen: {
        currentValue: false,
        previousValue: true,
        firstChange: false,
        isFirstChange: () => false
      }
    });

    expect(component.showClass).toBe(false);
  });

  it('should close modal on ESC key', () => {

    component.isOpen = true;
    const cerrarSpy = jest.spyOn(component, 'cerrar');
    component.handleKeyboardEvent();
    expect(cerrarSpy).toHaveBeenCalled();
  });

  it('should not close modal on ESC if isOpen is false', () => {
    component.isOpen = false;
    const cerrarSpy = jest.spyOn(component, 'cerrar');
    component.handleKeyboardEvent();
    expect(cerrarSpy).not.toHaveBeenCalled();
  });

  it('should emit close event when cerrar is called', () => {

    component.isOpen = true;
    const emitSpy = jest.spyOn(component.close, 'emit');
    component.cerrar();
    expect(component.showClass).toBe(false);
    jest.advanceTimersByTime(300);
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit close if modal is already closed', () => {

    component.isOpen = false;
    const emitSpy = jest.spyOn(component.close, 'emit');
    component.cerrar();
    jest.advanceTimersByTime(300);

    expect(emitSpy).not.toHaveBeenCalled();
  });

});