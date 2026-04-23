import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { Cliente, ClienteResponse } from '../../core/models/cliente.model';
import { ClienteService } from '../../features/clientes/services/cliente.service';

import { TableComponent } from '../../shared/table/table.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ClienteUpdatePayload } from '../../core/models/cliente-update.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent,
    ModalComponent,
    FormsModule
  ],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {

  clientes: ClienteResponse[] = [];
  clientesFiltrados: ClienteResponse[] = [];
  
  clientForm!: FormGroup;
  
  searchText: string = '';
  private searchSubject = new Subject<string>();

  loading = false;
  isModalOpen = false; // Estado para controlar la visibilidad del modal
  currentClientAction: 'create' | 'edit' = 'create';
  selectedClientId: number | null = null;

  columns = [
    { field: 'nombre', header: 'Nombre' },
    { field: 'identificacion', header: 'Identificación' },
    { field: 'direccion', header: 'Dirección' },
    { field: 'telefono', header: 'Teléfono' },
    { field: 'estadoTexto', header: 'Estado' }
  ];

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.cargarClientes();

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
    this.clientForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      genero: ['', [Validators.required]],
      edad: [null, [Validators.required, Validators.min(18), Validators.max(99)]],
      identificacion: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      clienteId: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(4)]],
      estado: [true]
    });
  }

  cargarClientes(): void {
    this.loading = true;
    this.clienteService
      .listar()
      .subscribe({
        next: (response) => {
          this.clientes = response.data;
          this.filtrar(this.searchText);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar clientes:', error);
          this.loading = false;
        }
      });
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchText);
  }

  filtrar(searchTerm: string): void {
    if (!searchTerm) {
      this.clientesFiltrados = [...this.clientes];
    } else {
      this.clientesFiltrados = this.clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.identificacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.clienteId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }


  openClientModal(action: 'create' | 'edit', client?: Cliente): void {
    this.currentClientAction = action;
    this.isModalOpen = true; 
    this.clientForm.reset(); 

    if (action === 'edit' && client) {
      this.selectedClientId = client.id;
      this.clientForm.patchValue({
        id: client.id,
        nombre: client.nombre,
        genero: client.genero,
        edad: client.edad,
        identificacion: client.identificacion,
        direccion: client.direccion,
        telefono: client.telefono,
        clienteId: client.clienteId,
        contrasena: '', 
        estado: client.estado
      });
      this.clientForm.get('identificacion')?.disable();
      this.clientForm.get('clienteId')?.disable();
      this.clientForm.get('contrasena')?.disable();
    } else {
      this.selectedClientId = null;
      this.clientForm.get('identificacion')?.enable();
      this.clientForm.get('clienteId')?.enable();
      this.clientForm.get('contrasena')?.enable();
    }
  }


  closeClientModal(): void {
    this.isModalOpen = false; 
    this.clientForm.reset();
    this.selectedClientId = null;
    this.clientForm.get('identificacion')?.enable();
    this.clientForm.get('clienteId')?.enable();
    this.clientForm.get('contrasena')?.enable();
  }

  saveClient(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const formData = this.clientForm.getRawValue();
    
    if (this.currentClientAction === 'edit' && this.selectedClientId !== null) {
      const updatedClientData: ClienteUpdatePayload  = {
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono,
        estado: formData.estado
      };

      this.clienteService
        .actualizar(this.selectedClientId, updatedClientData)
        .subscribe({
          next: () => {
            this.closeClientModal();
            this.cargarClientes();
            alert('Cliente actualizado correctamente!'); // Feedback al usuario
          },
          error: (error) => {
            console.error('Error al actualizar cliente:', error);
            alert('Error al actualizar cliente.'); // Feedback al usuario
          }
        });
    } else { 
      const newClientData: Cliente = {
        id: 0, 
        nombre: formData.nombre,
        genero: formData.genero,
        edad: formData.edad,
        identificacion: formData.identificacion,
        direccion: formData.direccion,
        telefono: formData.telefono,
        clienteId: formData.clienteId,
        contrasena: formData.contrasena,
        estado: formData.estado
      };

      this.clienteService
        .crear(newClientData)
        .subscribe({
          next: () => {
            this.closeClientModal();
            this.cargarClientes();
            alert('Cliente creado correctamente!'); // Feedback al usuario
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
            alert('Error al crear cliente.'); // Feedback al usuario
          }
        });
    }
  }

  confirmDeleteClient(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.')) {
      this.clienteService
        .eliminar(id)
        .subscribe({
          next: () => {
            this.cargarClientes();
            alert('Cliente eliminado correctamente!'); // Feedback al usuario
          },
          error: (error) => {
            console.error('Error al eliminar cliente:', error);
            alert('Error al eliminar cliente.'); // Feedback al usuario
          }
        });
    }
  }
}