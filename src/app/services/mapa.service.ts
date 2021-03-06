import { Injectable } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { GeolocationPosition, Plugins } from "@capacitor/core";

const { Geolocation } = Plugins;

declare var google;

@Injectable({
  providedIn: 'root'
})
export class MapaService
{
  posicion: GeolocationPosition;
  direccion: NativeGeocoderResult;

  constructor(private nativeGeocoder: NativeGeocoder) 
  {

  }

  async locate()
  {
    const coordinates = await Geolocation.getCurrentPosition();
    this.posicion = coordinates;
  }

  public async reverse(latitude: number, longitude: number)
  {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    const direccion = await this.nativeGeocoder.reverseGeocode(latitude, longitude, options);
    this.direccion = direccion[0];
    return this.direccion;
  }



}

