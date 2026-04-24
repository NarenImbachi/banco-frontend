/// <reference types="jest" />

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';

describe('TableComponent', () => {

  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.columns).toEqual([]);
    expect(component.data).toEqual([]);
    expect(component.loading).toBe(false);
    expect(component.showActions).toBe(true);
  });

  it('should emit edit event with row data', () => {
    const row = { id: 1, nombre: 'Juan' };
    const spy = jest.spyOn(component.edit, 'emit');
    component.onEdit(row);
    expect(spy).toHaveBeenCalledWith(row);
  });

  it('should emit delete event with id', () => {
    const spy = jest.spyOn(component.delete, 'emit');
    component.onDelete(1);
    expect(spy).toHaveBeenCalledWith(1);
  });

});