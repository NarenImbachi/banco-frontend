import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Cliente } from '../../core/models/cliente.model';
import { ReporteMovimientoResponse } from '../../core/models/reporte-movimiento.model';
import { ReporteService } from '../../features/reportes/service/reporte.service';
import { TableComponent } from '../../shared/table/table.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ClienteService } from '../../features/clientes/services/cliente.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableComponent
  ],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit, OnDestroy {

  clientes: Cliente[] = [];

  clienteId: number | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';

  reporte: ReporteMovimientoResponse[] = [];

  loading = false;

  private destroy$ = new Subject<void>();

  columns = [
    { field: 'fecha', header: 'Fecha' },
    { field: 'cliente', header: 'Cliente' },
    { field: 'numeroCuenta', header: 'Numero Cuenta' },
    { field: 'tipoCuenta', header: 'Tipo' },
    { field: 'saldoInicial', header: 'Saldo Inicial' },
    { field: 'estado', header: 'Estado' },
    { field: 'movimiento', header: 'Movimiento' },
    { field: 'saldoDisponible', header: 'Saldo Disponible' }
  ];

  constructor(
    private clienteService: ClienteService,
    private reporteService: ReporteService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarClientes(): void {

    this.clienteService.listar()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.clientes = response.data;
        },
        error: () => {
          alert('Error al cargar clientes');
        }
      });
  }

  generarReporte(): void {

    if (!this.clienteId ||
        !this.fechaInicio ||
        !this.fechaFin) {

      alert('Debe seleccionar cliente y rango de fechas.');
      return;
    }

    this.loading = true;

    this.reporteService.generarEstadoCuenta(
      this.clienteId,
      this.fechaInicio,
      this.fechaFin
    )
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {

        this.reporte = resp.data;

        this.loading = false;

      },
      error: () => {

        alert('Error al generar reporte');

        this.loading = false;

      }
    });
  }

  generarPDF(): void {

    if (this.reporte.length === 0) {
      alert('No hay datos para generar PDF.');
      return;
    }

    const doc = new jsPDF();

    doc.text('Estado de Cuenta', 14, 10);

    const rows = this.reporte.map(r => [
      r.fecha,
      r.cliente,
      r.numeroCuenta,
      r.tipoCuenta,
      r.saldoInicial,
      r.estado ? 'Activo' : 'Inactivo',
      r.movimiento,
      r.saldoDisponible
    ]);

    autoTable(doc, {
      head: [[
        'Fecha',
        'Cliente',
        'Cuenta',
        'Tipo',
        'Saldo Inicial',
        'Estado',
        'Movimiento',
        'Saldo Disponible'
      ]],
      body: rows
    });

    doc.save('estado-cuenta.pdf');
  }

}