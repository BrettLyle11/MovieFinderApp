import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-to-playlist-dialog',
  templateUrl: './add-to-playlist-dialog.component.html',
  styleUrls: ['./add-to-playlist-dialog.component.css']
})
export class AddToPlaylistDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddToPlaylistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(selectedPlaylists: any): void {
    this.dialogRef.close(selectedPlaylists.map((option: any) => option.value));
  }
}