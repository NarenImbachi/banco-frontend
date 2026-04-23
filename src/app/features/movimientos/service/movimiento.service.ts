import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CreateMovimientoRequest, MovimientoListadoResponse, MovimientoResponse } from '../../../core/models/movimiento.model';
import { ApiResponse } from '../../../core/response/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private apiUrl = `http://localhost:8080/api/movimientos`;

  constructor(private http: HttpClient) { }

  /**
   * Registra un nuevo movimiento en una cuenta.
   * @param movimiento Los datos del movimiento a registrar.
   * @returns Un Observable con el movimiento registrado.
   */
  createMovement(movimiento: CreateMovimientoRequest): Observable<MovimientoResponse> {
    // La fecha en CreateMovimientoRequest ya debe venir como 'YYYY-MM-DD'
    return this.http.post<ApiResponse<MovimientoResponse>>(this.apiUrl, movimiento).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al registrar el movimiento');
        }
        return response.data;
      })
    );
  }

  /**
   * Elimina un movimiento por su ID.
   * @param id El ID del movimiento a eliminar.
   * @returns Un Observable con el resultado de la operación.
   */
  deleteMovement(id: number): Observable<void> {
    return this.http.delete<ApiResponse<Object>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al eliminar el movimiento');
        }
        // No hay 'data' en un delete exitoso, solo el éxito de la operación
        return;
      })
    );
  }

  /**
   * Obtiene un listado de movimientos con información adicional para la vista de movimientos.
   * Nuevo endpoint: GET /api/movimientos/listado
   * @returns Un Observable con la lista de movimientos en formato listado.
   */
  getMovimientosListado() {
    return this.http.get<ApiResponse<MovimientoListadoResponse[]>>(`${this.apiUrl}/listado`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener el listado de movimientos');
        }
        return response.data || [];
      })
    );
  }
}
