/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientosComponent } from './movimientos.component';
import { MovimientoService } from '../../features/movimientos/service/movimiento.service';
import { CuentaService } from '../../features/cuentas/service/cuenta.service';
import { of } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const mockMovimientoService = {
  getMovimientosListado: jest.fn(),
  createMovement: jest.fn(),
  deleteMovement: jest.fn()
};

const mockCuentaService = {
  getAccounts: jest.fn()
};

describe('MovimientosComponent', () => {

  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;
  let movimientoService: any;
  let cuentaService: any;

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => { });
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MovimientosComponent,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: MovimientoService, useValue: mockMovimientoService },
        { provide: CuentaService, useValue: mockCuentaService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    component = fixture.componentInstance;

    movimientoService = TestBed.inject(MovimientoService);
    cuentaService = TestBed.inject(CuentaService);

    cuentaService.getAccounts.mockReturnValue(of([]));
    movimientoService.getMovimientosListado.mockReturnValue(of([]));

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on init', () => {

    component.ngOnInit();

    expect(component.movimientoForm).toBeDefined();
    expect(component.movimientoForm.valid).toBe(false);
  });

  it('should load cuentas on init', () => {
    cuentaService.getAccounts.mockReturnValue(of([]));
    movimientoService.getMovimientosListado.mockReturnValue(of([]));

    component.ngOnInit();

    expect(cuentaService.getAccounts).toHaveBeenCalled();
  });

  it('should open modal', () => {
    component.initializeForm();

    component.openMovimientoModal();

    expect(component.isModalOpen).toBe(true);
  });

  it('should call createMovement on save', () => {
    component.initializeForm();

    movimientoService.createMovement.mockReturnValue(of({}));

    component.movimientoForm.patchValue({
      cuentaId: 1,
      tipo: 'DEPOSITO',
      valor: 100,
      fecha: '2024-01-01'
    });

    component.saveMovimiento();

    expect(movimientoService.createMovement).toHaveBeenCalled();
  });

  it('should delete movimiento when confirmed', () => {
    movimientoService.deleteMovement.mockReturnValue(of({}));

    component.confirmDeleteMovimiento(1);

    expect(movimientoService.deleteMovement).toHaveBeenCalledWith(1);
  });

  it('should filter movimientos by cuentaId', () => {
    const mockMovs = [
      { cuentaId: 1, fecha: '2024-01-01' },
      { cuentaId: 2, fecha: '2024-01-01' }
    ];

    movimientoService.getMovimientosListado.mockReturnValue(of(mockMovs));
    cuentaService.getAccounts.mockReturnValue(of([]));

    component.selectedCuentaIdFilter = 1;

    component.applyFiltersAndLoad();

    expect(component.movimientos.length).toBe(1);
  });

});