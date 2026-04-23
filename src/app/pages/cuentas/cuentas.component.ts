import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalComponent } from '../../shared/modal/modal.component';
import { TableComponent } from '../../shared/table/table.component';
import { CreateCuentaRequest, Cuenta, TipoCuenta, UpdateCuentaRequest } from '../../core/models/cuenta.model';
import { Cliente } from '../../core/models/cliente.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ClienteService } from '../../features/clientes/services/cliente.service';
import { CuentaService } from '../../features/cuentas/service/cuenta.service';

@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent {
  cuentas: Cuenta[] = [];
  cuentasFiltradas: Cuenta[] = [];
  clientes: Cliente[] = []; // Para poblar el select de clientes en el formulario

  cuentaForm!: FormGroup;

  searchText: string = '';
  private searchSubject = new Subject<string>();

  loading = false;
  isModalOpen = false;
  currentAccountAction: 'create' | 'edit' = 'create';
  selectedAccountId: number | null = null;

  // Columnas para la tabla reutilizable
  columns = [
    { field: 'numeroCuenta', header: 'Número de Cuenta' },
    { field: 'tipo', header: 'Tipo' },
    { field: 'saldoInicial', header: 'Saldo Inicial' },
    { field: 'saldoDisponible', header: 'Saldo Disponible' },
    { field: 'estadoTexto', header: 'Estado' },
    { field: 'clienteNombre', header: 'Cliente' }
  ];

  TipoCuenta = TipoCuenta;

  constructor(
    private cuentaService: CuentaService,
    private clienteService: ClienteService, // Inyectamos ClienteService
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.cargarCuentas();
    this.cargarClientesParaFormulario(); // Cargar clientes para el dropdown

    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.filtrar(searchTerm);
      });
  }

  initializeForm(): void {
    this.cuentaForm = this.fb.group({
      id: [null], // Campo para el ID de la cuenta al editar
      numeroCuenta: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]], // Ejemplo de 6 dígitos numéricos
      tipo: ['', [Validators.required]],
      saldoInicial: [null, [Validators.required, Validators.min(0)]],
      estado: [true],
      clienteId: [null, [Validators.required]] // Será el ID numérico del cliente
    });
  }

  cargarCuentas(): void {
    this.loading = true;
    this.cuentaService.getAccounts().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        console.log('Cuentas cargadas:', cuentas);
        this.filtrar(this.searchText);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar cuentas:', error);
        this.loading = false;
        // Considerar mostrar un mensaje de error al usuario
      }
    });
  }

  cargarClientesParaFormulario(): void {
    this.clienteService.listar().subscribe({
      next: (response) => {
        this.clientes = response.data;
      },
      error: (error) => {
        console.error('Error al cargar clientes para el formulario de cuenta:', error);
      }
    });
  }

  // Maneja el cambio en el input de búsqueda
  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  filtrar(searchTerm: string): void {
    let cuentasBase = [...this.cuentas];
    const cuentasConNombre = cuentasBase.map(cuenta => ({
      ...cuenta,
      clienteNombre: this.getNombreCliente(
        cuenta.clienteId
      )

    }));

    if (!searchTerm) {
      this.cuentasFiltradas = cuentasConNombre;
    } else {
      this.cuentasFiltradas = cuentasConNombre.filter(cuenta =>
        cuenta.numeroCuenta
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cuenta.tipo
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        cuenta.clienteNombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }
  }

  getNombreCliente(clienteId: number): string {
    const cliente = this.clientes.find(
      c => c.id === clienteId
    );
    return cliente ? cliente.nombre : 'Sin cliente';
  }

  openAccountModal(action: 'create' | 'edit', cuenta?: Cuenta): void {
    this.currentAccountAction = action;
    this.isModalOpen = true;
    this.cuentaForm.reset();

    if (action === 'edit' && cuenta) {
      this.selectedAccountId = cuenta.id;
      this.cuentaForm.patchValue({
        id: cuenta.id,
        numeroCuenta: cuenta.numeroCuenta,
        tipo: cuenta.tipo,
        saldoInicial: cuenta.saldoInicial,
        estado: cuenta.estado,
        clienteId: cuenta.clienteId
      });
      this.cuentaForm.get('numeroCuenta')?.disable();
      this.cuentaForm.get('saldoInicial')?.disable();
      this.cuentaForm.get('clienteId')?.disable();
    } else {
      this.selectedAccountId = null;
      this.cuentaForm.get('numeroCuenta')?.enable();
      this.cuentaForm.get('saldoInicial')?.enable();
      this.cuentaForm.get('clienteId')?.enable();
      this.cuentaForm.get('estado')?.setValue(true);
    }
  }

  closeAccountModal(): void {
    this.isModalOpen = false;
    this.cuentaForm.reset();
    this.selectedAccountId = null;
    this.cuentaForm.get('numeroCuenta')?.enable();
    this.cuentaForm.get('saldoInicial')?.enable();
    this.cuentaForm.get('clienteId')?.enable();
  }

  saveAccount(): void {
    if (this.cuentaForm.invalid) {
      this.cuentaForm.markAllAsTouched();
      return;
    }

    const formData = this.cuentaForm.getRawValue();

    if (this.currentAccountAction === 'edit' && this.selectedAccountId !== null) {
      const updatePayload: UpdateCuentaRequest = {
        tipo: formData.tipo,
        estado: formData.estado
      };

      this.cuentaService.updateAccount(this.selectedAccountId, updatePayload).subscribe({
        next: () => {
          this.closeAccountModal();
          this.cargarCuentas();
          alert('Cuenta actualizada correctamente!');
        },
        error: (error) => {
          console.error('Error al actualizar cuenta:', error);
          alert('Error al actualizar cuenta.');
        }
      });
    } else {
      const createPayload: CreateCuentaRequest = {
        numeroCuenta: formData.numeroCuenta,
        tipo: formData.tipo,
        saldoInicial: formData.saldoInicial,
        estado: formData.estado,
        clienteId: formData.clienteId
      };

      this.cuentaService.createAccount(createPayload).subscribe({
        next: () => {
          this.closeAccountModal();
          this.cargarCuentas();
          alert('Cuenta creada correctamente!');
        },
        error: (error) => {
          console.error('Error al crear cuenta:', error);
          alert('Error al crear cuenta.');
        }
      });
    }
  }

  confirmDeleteAccount(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta cuenta? Esta acción no se puede deshacer.')) {
      this.cuentaService.deleteAccount(id).subscribe({
        next: () => {
          this.cargarCuentas();
          alert('Cuenta eliminada correctamente!');
        },
        error: (error) => {
          console.error('Error al eliminar cuenta:', error);
          alert('Error al eliminar cuenta. Asegúrate de que no tenga movimientos asociados.');
        }
      });
    }
  }
}
