/// <reference types="jest" />

import jsPDF from 'jspdf';

jest.mock('jspdf', () => {

  return jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn()
  }));
});

jest.mock('jspdf-autotable', () => {
  return jest.fn();
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportesComponent } from './reportes.component';
import { ClienteService } from '../../features/clientes/services/cliente.service';
import { ReporteService } from '../../features/reportes/service/reporte.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

const mockClienteService = {
  listar: jest.fn()
};

const mockReporteService = {
  generarEstadoCuenta: jest.fn()
};

describe('ReportesComponent', () => {

  let component: ReportesComponent;
  let fixture: ComponentFixture<ReportesComponent>;
  let clienteService: any;
  let reporteService: any;

  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReportesComponent,
        FormsModule
      ],
      providers: [
        { provide: ClienteService, useValue: mockClienteService },
        { provide: ReporteService, useValue: mockReporteService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReportesComponent);
    component = fixture.componentInstance;

    clienteService = TestBed.inject(ClienteService);
    reporteService = TestBed.inject(ReporteService);

    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clientes on init', () => {

    const mockResp = {
      data: [{ id: 1, nombre: 'Juan' }]
    };

    clienteService.listar.mockReturnValue(of(mockResp));

    component.ngOnInit();

    expect(clienteService.listar).toHaveBeenCalled();
    expect(component.clientes.length).toBe(1);
  });

  it('should handle error when loading clientes', () => {

    clienteService.listar.mockReturnValue(throwError(() => new Error()));

    component.cargarClientes();

    expect(window.alert).toHaveBeenCalledWith('Error al cargar clientes');
  });

  it('should not generate reporte if fields are missing', () => {

    component.generarReporte();

    expect(window.alert).toHaveBeenCalledWith(
      'Debe seleccionar cliente y rango de fechas.'
    );
    expect(reporteService.generarEstadoCuenta).not.toHaveBeenCalled();
  });

  it('should generate reporte', () => {

    const mockResp = {
      data: [{ cliente: 'Juan' }]
    };

    reporteService.generarEstadoCuenta.mockReturnValue(of(mockResp));

    component.clienteId = 1;
    component.fechaInicio = '2024-01-01';
    component.fechaFin = '2024-01-31';

    component.generarReporte();

    expect(reporteService.generarEstadoCuenta).toHaveBeenCalledWith(
      1,
      '2024-01-01',
      '2024-01-31'
    );

    expect(component.reporte.length).toBe(1);
    expect(component.loading).toBe(false);
  });

  it('should handle error when generating reporte', () => {

    reporteService.generarEstadoCuenta.mockReturnValue(
      throwError(() => new Error())
    );

    component.clienteId = 1;
    component.fechaInicio = '2024-01-01';
    component.fechaFin = '2024-01-31';

    component.generarReporte();

    expect(window.alert).toHaveBeenCalledWith('Error al generar reporte');
    expect(component.loading).toBe(false);
  });

  it('should not generate PDF if no data', () => {

    component.reporte = [];

    component.generarPDF();

    expect(window.alert).toHaveBeenCalledWith(
      'No hay datos para generar PDF.'
    );
  });

  it('should generate PDF', () => {

    const saveMock = jest.fn();

    (jsPDF as unknown as jest.Mock).mockImplementation(() => ({
      text: jest.fn(),
      save: saveMock
    }));

    component.reporte = [
      {
        fecha: '2024-01-01',
        cliente: 'Juan',
        numeroCuenta: '123',
        tipoCuenta: 'Ahorro',
        saldoInicial: 100,
        estado: true,
        movimiento: 50,
        saldoDisponible: 150
      }
    ];

    component.generarPDF();

    expect(saveMock).toHaveBeenCalled();
  });

});