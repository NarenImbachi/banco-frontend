import { TestBed } from '@angular/core/testing';
import { MovimientoService } from './movimiento.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiResponse } from '../../../core/response/api-response.model';
import { MovimientoResponse, MovimientoListadoResponse } from '../../../core/models/movimiento.model';

describe('MovimientoService', () => {

  let service: MovimientoService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080/api/movimientos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovimientoService]
    });

    service = TestBed.inject(MovimientoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create movement', () => {

    const mockResponse: ApiResponse<MovimientoResponse> = {
      success: true,
      message: 'ok',
      code: '201',
      data: { id: 1 } as MovimientoResponse
    };

    service.createMovement({} as any).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should throw error when createMovement fails', () => {

    const mockResponse: ApiResponse<MovimientoResponse> = {
      success: false,
      message: 'error al crear',
      code: '400',
      data: null as any
    };

    service.createMovement({} as any).subscribe({
      next: () => fail('should fail'),
      error: err => {
        expect(err.message).toBe('error al crear');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush(mockResponse);
  });

  it('should delete movement', () => {

    const mockResponse: ApiResponse<Object> = {
      success: true,
      message: 'ok',
      code: '200',
      data: {}
    };

    service.deleteMovement(1).subscribe(res => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should throw error when deleteMovement fails', () => {

    const mockResponse: ApiResponse<Object> = {
      success: false,
      message: 'error al eliminar',
      code: '400',
      data: {}
    };

    service.deleteMovement(1).subscribe({
      next: () => fail('should fail'),
      error: err => {
        expect(err.message).toBe('error al eliminar');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush(mockResponse);
  });

  it('should get movimientos listado', () => {

    const mockResponse: ApiResponse<MovimientoListadoResponse[]> = {
      success: true,
      message: 'ok',
      code: '200',
      data: [{ cuentaId: 1 } as MovimientoListadoResponse]
    };

    service.getMovimientosListado().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].cuentaId).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/listado`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error when getMovimientosListado fails', () => {

    const mockResponse: ApiResponse<MovimientoListadoResponse[]> = {
      success: false,
      message: 'error listado',
      code: '400',
      data: []
    };

    service.getMovimientosListado().subscribe({
      next: () => fail('should fail'),
      error: err => {
        expect(err.message).toBe('error listado');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/listado`);
    req.flush(mockResponse);
  });

});