import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Producto } from "../clases/producto";
import { CodigoQRService } from './codigo-qr.service';


@Injectable({
  providedIn: 'root'
})
export class ProductoService
{

  public static productos: Producto[] = [];
  private rutaDB = '/productos';

  referenciaProductos: AngularFireList<Producto> = null;

  constructor(private db: AngularFireDatabase, private escanerQR: CodigoQRService)
  {
    try
    {
      this.referenciaProductos = db.list(this.rutaDB);
    } catch (error)
    {
      console.log("Error: ", error);
    }

  }

  traerTodos()
  {
    try
    {
      let productos = [];

      const fetch = new Promise<Producto[]>(resolve =>
      {
        this.db.database.ref('productos').on('value', (snapshot) =>
        {
          productos = [];
          snapshot.forEach((child) =>
          {
            let data: Producto = child.val();
            productos.push(new Producto(data as Producto));
          });
          ProductoService.productos = productos.filter(producto => producto.isActive == true);

          resolve(ProductoService.productos);
        })
      });
      return fetch;
    } catch (error)
    {
      console.log("Error: ", error);
    }

  }

  registrar(producto: Producto): Promise<any>
  {
    try
    {
      producto.isActive = true;
      producto.isReady = false;

      return this.referenciaProductos
        .push(producto)
        .then((snapshot) => producto.id = snapshot.key)
        .then(() => this.actualizar(producto))
        .catch(console.error);
    } catch (error)
    {
      console.log("No se pudo registrar: ", error);
    }

  }

  public actualizar(producto: Producto): Promise<any>
  {
    return new Promise((resolve, reject) =>
    {
      this.escanerQR.generar(producto, producto.id).then(() => 
      {
        resolve(this.db.database.ref('productos/' + producto.id).update(producto));
      }).catch(error => reject(error));
    });
  }

  eliminar(producto: Producto): Promise<void>
  {
    try
    {

      producto.isActive = false;
      return this.actualizar(producto)
        .then(() =>
        {
          console.info("Borrado")
        });
    } catch (error)
    {
      console.log("No se pudo Borrar: ", error);
    }

  }



}
