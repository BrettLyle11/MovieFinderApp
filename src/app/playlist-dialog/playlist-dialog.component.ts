import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-playlist-dialog',
  templateUrl: './playlist-dialog.component.html',
  styleUrls: ['./playlist-dialog.component.css'],
})
export class PlaylistDialogComponent {
  playlistForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PlaylistDialogComponent>
  ) {
    this.playlistForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.playlistForm.valid) {
      this.dialogRef.close(this.playlistForm.value);
    }
  }
}
