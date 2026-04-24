/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentasComponent } from './cuentas.component';
import { CuentaService } from '../../features/cuentas/service/cuenta.service';
import { ClienteService } from '../../features/clientes/services/cliente.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CuentasComponent', () => {

  let component: CuentasComponent;
  let fixture: ComponentFixture<CuentasComponent>;
  let cuentaService: any;
  let clienteService: any;

  const mockCuentaService = {
    getAccounts: jest.fn(),
    createAccount: jest.fn(),
    updateAccount: jest.fn(),
    deleteAccount: jest.fn()
  };

  const mockClienteService = {
    listar: jest.fn()
  };

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CuentasComponent,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: CuentaService, useValue: mockCuentaService },
        { provide: ClienteService, useValue: mockClienteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CuentasComponent);
    component = fixture.componentInstance;

    cuentaService = TestBed.inject(CuentaService);
    clienteService = TestBed.inject(ClienteService);

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load accounts on init', () => {

    mockCuentaService.getAccounts.mockReturnValue(of([]));
    mockClienteService.listar.mockReturnValue(of({ data: [] }));

    component.ngOnInit();

    expect(mockCuentaService.getAccounts).toHaveBeenCalled();
  });

  it('should initialize form invalid', () => {
    component.initializeForm();
    expect(component.cuentaForm.valid).toBe(false);
  });

  it('should validate form correctly', () => {

    component.initializeForm();

    component.cuentaForm.patchValue({
      numeroCuenta: '123456',
      tipo: 'AHORROS',
      saldoInicial: 100,
      estado: true,
      clienteId: 1
    });

    expect(component.cuentaForm.valid).toBe(true);
  });

  it('should filter accounts', () => {

    component.clientes = [{ id: 1, nombre: 'Juan' } as any];

    component.cuentas = [
      { numeroCuenta: '123456', tipo: 'AHORROS', clienteId: 1 } as any
    ];

    component.filtrar('juan');

    expect(component.cuentasFiltradas.length).toBe(1);
  });

  it('should open modal in create mode', () => {

    component.initializeForm();
    component.openAccountModal('create');

    expect(component.isModalOpen).toBe(true);
    expect(component.currentAccountAction).toBe('create');
  });

  it('should call createAccount when saving new account', () => {

    component.initializeForm();

    mockCuentaService.createAccount.mockReturnValue(of({}));

    component.cuentaForm.patchValue({
      numeroCuenta: '123456',
      tipo: 'AHORROS',
      saldoInicial: 100,
      estado: true,
      clienteId: 1
    });

    component.saveAccount();

    expect(mockCuentaService.createAccount).toHaveBeenCalled();
  });

  it('should call updateAccount when editing', () => {

    component.initializeForm();

    component.currentAccountAction = 'edit';
    component.selectedAccountId = 1;

    mockCuentaService.updateAccount.mockReturnValue(of({}));

    component.cuentaForm.setValue({
      id: 1,
      numeroCuenta: '123456',
      tipo: 'AHORROS',
      saldoInicial: 100,
      estado: true,
      clienteId: 1
    });

    component.saveAccount();

    expect(mockCuentaService.updateAccount).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        tipo: 'AHORROS',
        estado: true
      })
    );
  });

  it('should delete account when confirmed', () => {

    mockCuentaService.deleteAccount.mockReturnValue(of({}));

    component.confirmDeleteAccount(1);

    expect(mockCuentaService.deleteAccount).toHaveBeenCalledWith(1);
  });

});