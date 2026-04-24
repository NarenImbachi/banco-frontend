/// <reference types="jest" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientesComponent } from './clientes.component';
import { ClienteService } from '../../features/clientes/services/cliente.service';
import { of } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


const mockClienteService = {
  listar: jest.fn(),
  crear: jest.fn(),
  actualizar: jest.fn(),
  eliminar: jest.fn()
};

describe('ClientesComponent', () => {

  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let clienteService: any;

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => { });
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientesComponent,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        { provide: ClienteService, useValue: mockClienteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    clienteService = TestBed.inject(ClienteService);

    jest.clearAllMocks();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on init', () => {

    const mockResponse = {
      success: true,
      data: [{ nombre: 'Juan', identificacion: '123', clienteId: 'C1' }]
    };

    clienteService.listar.mockReturnValue(of(mockResponse));

    component.ngOnInit();

    expect(clienteService.listar).toHaveBeenCalled();
    expect(component.clientes.length).toBe(1);
    expect(component.loading).toBe(false);
  });

  it('should initialize form invalid', () => {
    component.initializeForm();
    expect(component.clientForm.valid).toBe(false);
  });

  it('should validate form correctly', () => {
    component.initializeForm();

    component.clientForm.patchValue({
      nombre: 'Juan Perez',
      genero: 'M',
      edad: 25,
      identificacion: '1234567890',
      direccion: 'Calle 1',
      telefono: '1234567890',
      clienteId: 'C1',
      contrasena: '1234',
      estado: true
    });

    expect(component.clientForm.valid).toBe(true);
  });

  it('should filter clients by nombre', () => {

    component.clientes = [
      { nombre: 'Juan', identificacion: '123', clienteId: 'A' } as any,
      { nombre: 'Maria', identificacion: '456', clienteId: 'B' } as any
    ];

    component.filtrar('juan');

    expect(component.clientesFiltrados.length).toBe(1);
    expect(component.clientesFiltrados[0].nombre).toBe('Juan');
  });

  it('should open modal in create mode', () => {

    component.initializeForm();
    component.openClientModal('create');

    expect(component.isModalOpen).toBe(true);
    expect(component.currentClientAction).toBe('create');
    expect(component.selectedClientId).toBeNull();
  });

  it('should call crear when saving new client', () => {

    component.initializeForm();

    clienteService.crear.mockReturnValue(of({}));

    component.clientForm.patchValue({
      nombre: 'Juan',
      genero: 'M',
      edad: 25,
      identificacion: '1234567890',
      direccion: 'Calle',
      telefono: '1234567890',
      clienteId: 'C1',
      contrasena: '1234',
      estado: true
    });

    component.saveClient();

    expect(clienteService.crear).toHaveBeenCalled();
  });

  it('should call actualizar when editing client', () => {

    component.initializeForm();

    component.currentClientAction = 'edit';
    component.selectedClientId = 1;

    component.clientForm.setValue({
      id: 1,
      nombre: 'Juan',
      genero: 'M',
      edad: 30,
      identificacion: '1234567890',
      direccion: 'Calle 123',
      telefono: '1234567890',
      clienteId: 'C001',
      contrasena: '1234',
      estado: true
    });

    clienteService.actualizar.mockReturnValue(of({}));

    component.saveClient();

    expect(clienteService.actualizar).toHaveBeenCalledWith(
      1,
      expect.objectContaining({
        nombre: 'Juan',
        direccion: 'Calle 123',
        telefono: '1234567890',
        estado: true
      })
    );
  });

  it('should delete client when confirmed', () => {

    jest.spyOn(window, 'confirm').mockReturnValue(true);
    clienteService.eliminar.mockReturnValue(of({}));

    component.confirmDeleteClient(1);

    expect(clienteService.eliminar).toHaveBeenCalledWith(1);
  });

});

