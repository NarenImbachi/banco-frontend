import { Component, EventEmitter, Input, Output, OnInit, OnChanges, OnDestroy, HostListener, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements OnInit, OnChanges, OnDestroy {

  @Input() title: string = '';
  @Input() isOpen: boolean = false; 
  @Output() close = new EventEmitter<void>();

  showClass = false; 

  constructor() {}

  ngOnInit(): void {
    if (this.isOpen) {
      this.toggleShowClass(true);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      if (this.isOpen) {
        this.toggleShowClass(true);
      } else {
        this.toggleShowClass(false);
      }
    }
  }

  private toggleShowClass(state: boolean): void {
    if (state) {
      setTimeout(() => {
        this.showClass = true;
      }, 50); 
    } else {
      this.showClass = false;
    }
  }

  @HostListener('document:keydown.escape')
  handleKeyboardEvent(): void { 
    if (this.isOpen) { 
      this.cerrar();
    }
  }

  cerrar(): void { 
    if (!this.isOpen) return;

    this.toggleShowClass(false); 
    setTimeout(() => {
      this.close.emit();
    }, 300); 
  }

  ngOnDestroy(): void {
  }
}