import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-vista-previa-modal',
  templateUrl: './vista-previa-modal.component.html',
  styleUrls: ['./vista-previa-modal.component.css']
})
export class VistaPreviaModalComponent {

  headers: string[] = [];
  rows: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<VistaPreviaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.headers = data.headers;
    this.rows = data.rows;
  }

  cerrarModal(): void {
    this.dialogRef.close();
  }
}
