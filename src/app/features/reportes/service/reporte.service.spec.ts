import { TestBed } from '@angular/core/testing';
import { ReporteService } from './reporte.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiResponse } from '../../../core/response/api-response.model';
import { ReporteMovimientoResponse } from '../../../core/models/reporte-movimiento.model';

describe('ReporteService', () => {

  let service: ReporteService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080/api/reportes/estado-cuenta';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReporteService]
    });

    service = TestBed.inject(ReporteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get reporte estado cuenta with params', () => {

    const mockResponse: ApiResponse<ReporteMovimientoResponse[]> = {
      success: true,
      message: 'ok',
      code: '200',
      data: [{ numeroCuenta: '123' } as ReporteMovimientoResponse]
    };

    service.generarEstadoCuenta(1, '2024-01-01', '2024-01-31')
      .subscribe(res => {
        expect(res.success).toBe(true);
        expect(res.data.length).toBe(1);
      });

    const req = httpMock.expectOne(req =>
      req.url === apiUrl &&
      req.params.get('clienteId') === '1' &&
      req.params.get('fechaInicio') === '2024-01-01' &&
      req.params.get('fechaFin') === '2024-01-31'
    );

    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

});