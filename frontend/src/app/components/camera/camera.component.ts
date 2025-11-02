import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUploadModule, FileUploadEvent } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-camera',
  standalone: true,
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  imports: [
    CommonModule,
    HttpClientModule,
    FileUploadModule,
    ButtonModule,
    BadgeModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class CameraComponent {
  constructor(private messageService: MessageService) {}

  onBasicUploadAuto(event: FileUploadEvent) {
    console.log('Upload OK →', event);
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: 'Arquivo enviado com sucesso (auto-mode)'
    });
  }
}
