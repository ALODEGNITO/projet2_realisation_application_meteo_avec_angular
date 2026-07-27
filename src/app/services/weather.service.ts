import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { Weather } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<Weather> {

    const url =
      `${environment.apiUrl}/weather?q=${city}&appid=${environment.apiKey}&units=metric&lang=fr`;

    return this.http.get<any>(url).pipe(

      map(data => ({

        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon:
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`

      }))

    );

  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<Weather> {

    const url =
      `${environment.apiUrl}/weather?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric&lang=fr`;

    return this.http.get<any>(url).pipe(

      map(data => ({

        city: data.name,
        country: data.sys.country,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon:
          `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`

      }))

    );

  }

  getForecast(city: string): Observable<any[]> {

    const url =
      `${environment.apiUrl}/forecast?q=${city}&appid=${environment.apiKey}&units=metric&lang=fr`;

    return this.http.get<any>(url).pipe(

      map(response => {

        const forecasts: any[] = [];

        for (let i = 0; i < response.list.length; i += 8) {

          const item = response.list[i];

          forecasts.push({

            date: item.dt_txt,
            temperatureMin: item.main.temp_min,
            temperatureMax: item.main.temp_max,
            description: item.weather[0].description,
            icon:
              `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`

          });

        }

        return forecasts.slice(0, 5);

      })

    );

  }

}