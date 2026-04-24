import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent {

  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() showActions = true;
  @Input() actionButtons: { edit?: boolean, delete?: boolean } = { edit: true, delete: true };
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  onEdit(row: any) {
    this.edit.emit(row);
  }

  onDelete(id: number) {
    this.delete.emit(id);
  }
}