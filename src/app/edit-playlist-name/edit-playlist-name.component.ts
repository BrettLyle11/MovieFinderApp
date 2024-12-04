import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-playlist-name',
  templateUrl: './edit-playlist-name.component.html',
  styleUrls: ['./edit-playlist-name.component.css']
})
export class EditPlaylistNameDialogComponent {
  newPlaylistName: string = '';

  constructor(public dialogRef: MatDialogRef<EditPlaylistNameDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.newPlaylistName);
  }
}