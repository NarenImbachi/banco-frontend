import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateCuentaRequest, Cuenta, UpdateCuentaRequest } from '../../../core/models/cuenta.model';
import { ApiResponse } from '../../../core/response/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private apiUrl = `http://localhost:8080/api/cuentas`;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene una lista de todas las cuentas.
   * @returns Un Observable con la lista de cuentas.
   */
  getAccounts(): Observable<Cuenta[]> {
    return this.http.get<ApiResponse<Cuenta[]>>(this.apiUrl).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener las cuentas');
        }
        return response.data || [];
      })
    );
  }

  /**
   * Obtiene una cuenta por su ID.
   * @param id El ID de la cuenta.
   * @returns Un Observable con la cuenta encontrada.
   */
  getAccountById(id: number): Observable<Cuenta> {
    return this.http.get<ApiResponse<Cuenta>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Cuenta no encontrada');
        }
        return response.data;
      })
    );
  }

  /**
   * Obtiene una lista de cuentas asociadas a un cliente.
   * @param clienteId El ID del cliente.
   * @returns Un Observable con la lista de cuentas del cliente.
   */
  getAccountsByClientId(clienteId: number): Observable<Cuenta[]> {
    return this.http.get<ApiResponse<Cuenta[]>>(`${this.apiUrl}/cliente/${clienteId}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al obtener las cuentas del cliente');
        }
        return response.data || [];
      })
    );
  }

  /**
   * Crea una nueva cuenta.
   * @param cuenta La cuenta a crear.
   * @returns Un Observable con la cuenta creada.
   */
  createAccount(cuenta: CreateCuentaRequest): Observable<Cuenta> {
    return this.http.post<ApiResponse<Cuenta>>(this.apiUrl, cuenta).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al crear la cuenta');
        }
        return response.data;
      })
    );
  }

  /**
   * Actualiza una cuenta existente.
   * @param id El ID de la cuenta a actualizar.
   * @param cuenta Los datos de la cuenta a actualizar.
   * @returns Un Observable con la cuenta actualizada.
   */
  updateAccount(id: number, cuenta: UpdateCuentaRequest): Observable<Cuenta> {
    return this.http.put<ApiResponse<Cuenta>>(`${this.apiUrl}/${id}`, cuenta).pipe(
      map(response => {
        if (!response.success || !response.data) {
          throw new Error(response.message || 'Error al actualizar la cuenta');
        }
        return response.data;
      })
    );
  }

  /**
   * Elimina una cuenta por su ID.
   * @param id El ID de la cuenta a eliminar.
   * @returns Un Observable con el resultado de la operación.
   */
  deleteAccount(id: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error al eliminar la cuenta');
        }
        return response.data;
      })
    );
  }
}