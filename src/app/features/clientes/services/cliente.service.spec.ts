/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Cliente } from '../../../core/models/cliente.model';
import { ClienteUpdatePayload } from '../../../core/models/cliente-update.model';

describe('ClienteService', () => {

  let service: ClienteService;
  let httpMock: HttpTestingController;

  const API_URL = 'http://localhost:8080/api/clientes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });

    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // =========================
  // GET - listar
  // =========================
  it('debería listar clientes', () => {
    const mockResponse = {
      success: true,
      message: 'ok',
      code: 'CLIENTES_OK',
      data: []
    };

    service.listar().subscribe(res => {
      expect(res).toEqual(mockResponse);
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // =========================
  // GET - obtener por id
  // =========================
  it('debería obtener cliente por id', () => {
    const mockResponse = {
      success: true,
      message: 'ok',
      code: 'CLIENTE_OK',
      data: { id: 1, nombre: 'Juan' }
    };

    service.obtenerPorId(1).subscribe(res => {
      expect(res.data.id).toBe(1);
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // =========================
  // POST - crear
  // =========================
  it('debería crear cliente', () => {
    const cliente: Cliente = {
      id: 1,
      nombre: 'Juan'
    } as any;

    const mockResponse = {
      success: true,
      message: 'creado',
      code: 'CLIENTE_CREATED',
      data: cliente
    };

    service.crear(cliente).subscribe(res => {
      expect(res.data).toEqual(cliente);
    });

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(cliente);

    req.flush(mockResponse);
  });

  // =========================
  // PUT - actualizar
  // =========================
  it('debería actualizar cliente', () => {
    const payload: ClienteUpdatePayload = {
      nombre: 'Pedro'
    } as any;

    const mockResponse = {
      success: true,
      message: 'actualizado',
      code: 'CLIENTE_UPDATED',
      data: { id: 1, nombre: 'Pedro' }
    };

    service.actualizar(1, payload).subscribe(res => {
      expect(res.data.nombre).toBe('Pedro');
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush(mockResponse);
  });

  // =========================
  // DELETE - eliminar
  // =========================
  it('debería eliminar cliente', () => {
    const mockResponse = {
      success: true,
      message: 'eliminado',
      code: 'CLIENTE_DELETED',
      data: null
    };

    service.eliminar(1).subscribe(res => {
      expect(res.success).toBeTrue();
    });

    const req = httpMock.expectOne(`${API_URL}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  // =========================
  // ERROR
  // =========================
  it('debería manejar error HTTP', () => {
    service.listar().subscribe({
      next: () => fail('debería fallar'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(API_URL);
    req.flush('Error interno', { status: 500, statusText: 'Server Error' });
  });

});