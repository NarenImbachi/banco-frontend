import { TestBed } from '@angular/core/testing';
import { CuentaService } from './cuenta.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiResponse } from '../../../core/response/api-response.model';
import { Cuenta } from '../../../core/models/cuenta.model';

describe('CuentaService', () => {

  let service: CuentaService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:8080/api/cuentas';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CuentaService]
    });

    service = TestBed.inject(CuentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // GET ALL
  it('should get all accounts', () => {

    const mockResponse: ApiResponse<Cuenta[]> = {
      success: true,
      message: 'ok',
      code: '200',
      data: [{ id: 1 } as Cuenta]
    };

    service.getAccounts().subscribe(res => {
      expect(res.length).toBe(1);
      expect(res[0].id).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error when getAccounts fails', () => {

    const mockResponse: ApiResponse<Cuenta[]> = {
      success: false,
      message: 'error',
      code: '400',
      data: []
    };

    service.getAccounts().subscribe({
      next: () => fail('should fail'),
      error: err => {
        expect(err.message).toBe('error');
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush(mockResponse);
  });

  // GET BY ID
  it('should get account by id', () => {

    const mockResponse: ApiResponse<Cuenta> = {
      success: true,
      message: 'ok',
      code: '200',
      data: { id: 1 } as Cuenta
    };

    service.getAccountById(1).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should throw error when account not found', () => {

    const mockResponse: ApiResponse<Cuenta> = {
      success: false,
      message: 'no encontrada',
      code: '404',
      data: null as any
    };

    service.getAccountById(1).subscribe({
      next: () => fail('should fail'),
      error: err => {
        expect(err.message).toBe('no encontrada');
      }
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    req.flush(mockResponse);
  });

  // CREATE
  it('should create account', () => {

    const mockResponse: ApiResponse<Cuenta> = {
      success: true,
      message: 'ok',
      code: '201',
      data: { id: 1 } as Cuenta
    };

    service.createAccount({} as any).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // UPDATE
  it('should update account', () => {

    const mockResponse: ApiResponse<Cuenta> = {
      success: true,
      message: 'ok',
      code: '200',
      data: { id: 1 } as Cuenta
    };

    service.updateAccount(1, {} as any).subscribe(res => {
      expect(res.id).toBe(1);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  // DELETE
  it('should delete account', () => {

    const mockResponse: ApiResponse<void> = {
      success: true,
      message: 'ok',
      code: '200',
      data: undefined
    };

    service.deleteAccount(1).subscribe(res => {
      expect(res).toBeUndefined();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

});