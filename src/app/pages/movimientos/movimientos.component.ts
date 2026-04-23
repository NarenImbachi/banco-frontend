import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators'; // Importar catchError
import { Cuenta } from '../../core/models/cuenta.model';
import { MovimientoResponse, TipoMovimiento, CreateMovimientoRequest, MovimientoListadoResponse } from '../../core/models/movimiento.model';
import { CuentaService } from '../../features/cuentas/service/cuenta.service';
import { MovimientoService } from '../../features/movimientos/service/movimiento.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ModalComponent,
    FormsModule,
    CurrencyPipe
  ],
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.scss']
})
export class MovimientosComponent implements OnInit, OnDestroy {

  movimientos: MovimientoListadoResponse[] = [];
  cuentas: Cuenta[] = [];
  movimientoForm!: FormGroup;

  loading = false;
  isModalOpen = false;

  selectedCuentaIdFilter: number | null = null;
  fechaInicioFilter: string = '';
  fechaFinFilter: string = '';

  private destroy$ = new Subject<void>();

  columns = [
    { field: 'numeroCuenta', header: 'Numero Cuenta' },
    { field: 'tipoCuenta', header: 'Tipo' },
    { field: 'saldoInicial', header: 'Saldo Inicial' },
    { field: 'movimiento', header: 'Movimiento' }
  ];

  TipoMovimiento = TipoMovimiento;

  constructor(
    private movimientoService: MovimientoService,
    private cuentaService: CuentaService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.cargarCuentasParaFiltrosYFormulario();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.movimientoForm = this.fb.group({
      cuentaId: [null, [Validators.required]],
      tipo: ['', [Validators.required]],
      valor: [null, [Validators.required, Validators.min(0.01)]],
      fecha: ['', [Validators.required]]
    });
    this.movimientoForm.get('fecha')?.setValue(new Date().toISOString().substring(0, 10));
  }

  cargarCuentasParaFiltrosYFormulario(): void {
    this.loading = true;
    this.cuentaService.getAccounts().pipe(takeUntil(this.destroy$)).subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        this.applyFiltersAndLoad();
      },
      error: (error) => {
        console.error('Error al cargar cuentas para el formulario/filtros de movimiento:', error);
        alert('Error al cargar las cuentas disponibles.');
        this.loading = false;
      }
    });
  }

  // Método central para aplicar filtros y cargar movimientos
  applyFiltersAndLoad(): void {

    this.loading = true;

    this.movimientoService
      .getMovimientosListado()
      .pipe(
        takeUntil(this.destroy$),
        catchError(err => {

          console.error(
            'Error al cargar movimientos:',
            err
          );

          alert('Error al cargar movimientos');

          this.loading = false;

          return of([]);

        })
      )
      .subscribe(movs => {

        let filteredMovs = [...movs];

        if (this.selectedCuentaIdFilter !== null) {

          filteredMovs = filteredMovs.filter(
            mov =>
              mov.cuentaId ===
              this.selectedCuentaIdFilter
          );

        }

        if (this.fechaInicioFilter) {

          const inicio =
            new Date(this.fechaInicioFilter);

          filteredMovs =
            filteredMovs.filter(
              mov =>
                new Date(mov.fecha) >= inicio
            );

        }

        if (this.fechaFinFilter) {

          const fin =
            new Date(this.fechaFinFilter);

          filteredMovs =
            filteredMovs.filter(
              mov =>
                new Date(mov.fecha) <= fin
            );

        }

        this.movimientos = filteredMovs;

        this.loading = false;

      });

  }

  openMovimientoModal(): void {
    this.isModalOpen = true;
    this.movimientoForm.reset();
    this.movimientoForm.get('fecha')?.setValue(new Date().toISOString().substring(0, 10));
    if (this.selectedCuentaIdFilter !== null) {
      this.movimientoForm.get('cuentaId')?.setValue(this.selectedCuentaIdFilter);
    }
  }

  closeMovimientoModal(): void {
    this.isModalOpen = false;
    this.movimientoForm.reset();
  }

  saveMovimiento(): void {
    if (this.movimientoForm.invalid) {
      this.movimientoForm.markAllAsTouched();
      return;
    }

    const formData = this.movimientoForm.value;

    if (formData.tipo === TipoMovimiento.DEPOSITO) {
      formData.valor = Math.abs(formData.valor);
    } else if (formData.tipo === TipoMovimiento.RETIRO) {
      formData.valor = -Math.abs(formData.valor);
    }


    const createPayload: CreateMovimientoRequest = {
      cuentaId: formData.cuentaId,
      tipo: formData.tipo,
      valor: formData.valor,
      fecha: formData.fecha
    };

    this.movimientoService.createMovement(createPayload).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.closeMovimientoModal();
        this.resetFiltersAndLoad();
        alert('Movimiento registrado correctamente!');
      },
      error: (error) => {
        console.error('Error al registrar movimiento:', error);
        alert('Error al registrar movimiento: ' + (error.error?.message || error.message || 'Error desconocido'));
      }
    });
  }

  confirmDeleteMovimiento(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este movimiento? Esta acción no se puede deshacer y puede afectar el saldo de la cuenta.')) {
      this.movimientoService.deleteMovement(id).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.resetFiltersAndLoad();
          alert('Movimiento eliminado correctamente!');
        },
        error: (error) => {
          console.error('Error al eliminar movimiento:', error);
          alert('Error al eliminar movimiento: ' + (error.error?.message || error.message || 'Error desconocido'));
        }
      });
    }
  }

  resetFiltersAndLoad(): void {
    this.selectedCuentaIdFilter = null;
    this.fechaInicioFilter = '';
    this.fechaFinFilter = '';
    this.applyFiltersAndLoad();
  }
}