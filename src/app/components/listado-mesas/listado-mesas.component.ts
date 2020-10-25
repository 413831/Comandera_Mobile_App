import { Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Mesa } from 'src/app/clases/mesa';

@Component({
  selector: 'app-listado-mesas',
  templateUrl: './listado-mesas.component.html',
  styleUrls: ['./listado-mesas.component.scss'],
})
export class ListadoMesasComponent implements OnInit {
  @Input() mesas: Mesa[] = [];
  @Output() elegirMesa: EventEmitter<Mesa> = new EventEmitter<Mesa>();

  constructor(private loadingController: LoadingController) 
  { }

  ngOnInit() 
  {
    this.presentLoading('Cargando mesas...', 2000);
  }

  /**
   * Método para enviar mesa seleccionada
   * @param mesa Mesa seleccionada
   */
  seleccionarMesa(mesa: Mesa)
  {
    this.elegirMesa.emit(mesa);
  }

  /**
   * Método para presentar loading
   * @param message Mensaje del componente
   * @param duration Duracion del presentacion del mensaje
   */
  async presentLoading(message, duration) 
  {
    const loading = await this.loadingController.create({
      message,
      duration,
      spinner: 'crescent'
    });
    await loading.present();
  }

}