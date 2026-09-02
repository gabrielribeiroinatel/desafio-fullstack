import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecordService } from './record.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  name = '';
  department = '';
  reference_date = '';
  deliveries = 0;
  observation = '';

  message = '';

  constructor(private recordService: RecordService) {}

  submit() {
    const data = {
      name: this.name,
      department: this.department,
      reference_date: this.reference_date,
      deliveries: this.deliveries,
      observation: this.observation
    };

    this.recordService.createRecord(data).subscribe({
      next: () => {
        this.message = 'Registro salvo com sucesso!';
        this.name = '';
        this.department = '';
        this.reference_date = '';
        this.deliveries = 0;
        this.observation = '';
      },
      error: () => {
        this.message = 'Erro ao salvar registro.';
      }
    });
  }
}