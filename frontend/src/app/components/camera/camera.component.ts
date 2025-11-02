import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss']
})
export class CameraComponent {
  preview?: string;
  selectedFile?: File;

  constructor(private http: HttpClient) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => (this.preview = reader.result as string);
    reader.readAsDataURL(file);
  }

  sendImage() {
    if (!this.selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.http.post('http://localhost:3000/api/capture', { imageBase64: base64 }).subscribe({
        next: () => alert('Imagem enviada com sucesso!'),
        error: (err) => alert('Erro ao enviar: ' + err.message)
      });
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
