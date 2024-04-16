import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-photo-dialog-component',
  templateUrl: 'photo-dialog-component.component.html',
  
})
export class PhotoDialogComponentComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { fotos: string[], foto:string }) {}
}
