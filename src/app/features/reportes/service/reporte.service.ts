import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../core/response/api-response.model';
import { ReporteMovimientoResponse } from '../../../core/models/reporte-movimiento.model';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) {}

  generarEstadoCuenta(
    clienteId: number,
    fechaInicio: string,
    fechaFin: string
  ): Observable<ApiResponse<ReporteMovimientoResponse[]>> {

    const params = new HttpParams()
      .set('clienteId', clienteId)
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);

    return this.http.get<ApiResponse<ReporteMovimientoResponse[]>>(`${this.apiUrl}/estado-cuenta`,{ params });
  }
}