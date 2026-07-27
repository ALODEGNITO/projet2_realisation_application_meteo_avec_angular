import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchComponent } from '../../components/search/search.component';
import { WeatherCardComponent } from '../../components/weather-card/weather-card.component';

import { WeatherService } from '../../services/weather.service';
import { Weather } from '../../models/weather.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SearchComponent,
    WeatherCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  weather: Weather | null = null;

  historique: string[] = [];

  loading = false;

  errorMessage = '';

  constructor(
    private weatherService: WeatherService
  ) {

    // Charger l'historique sauvegardé
    const sauvegarde = localStorage.getItem('historique');

    if (sauvegarde) {
      this.historique = JSON.parse(sauvegarde);
    }

  }

  /**
   * Recherche météo par ville
   */
  rechercherVille(ville: string) {

    this.loading = true;

    this.errorMessage = '';

    this.weatherService.getCurrentWeather(ville)

      .subscribe({

        next: (data) => {

          this.weather = data;

          this.loading = false;

          this.errorMessage = '';

          // Ajouter la ville à l'historique
          this.ajouterHistorique(ville);

        },

        error: () => {

          this.weather = null;

          this.loading = false;

          this.errorMessage = "Ville introuvable.";

        }

      });

  }

  /**
   * Recherche météo par géolocalisation
   */
  obtenirMaPosition() {

    if (!navigator.geolocation) {

      alert("Votre navigateur ne supporte pas la géolocalisation.");

      return;

    }

    this.loading = true;

    navigator.geolocation.getCurrentPosition(

      (position) => {

        this.weatherService

          .getWeatherByCoordinates(

            position.coords.latitude,

            position.coords.longitude

          )

          .subscribe({

            next: (data) => {

              this.weather = data;

              this.loading = false;

              this.errorMessage = '';

              // Ajouter automatiquement la ville détectée
              this.ajouterHistorique(data.city);

            },

            error: () => {

              this.loading = false;

              this.errorMessage =
                "Impossible de récupérer votre position.";

            }

          });

      },

      () => {

        this.loading = false;

        this.errorMessage =
          "Vous avez refusé l'accès à la localisation.";

      }

    );

  }

  /**
   * Ajouter une ville à l'historique
   */
  private ajouterHistorique(ville: string) {

    ville = ville.trim();

    if (!ville) {
      return;
    }

    // Supprimer les doublons
    this.historique = this.historique.filter(
      v => v.toLowerCase() !== ville.toLowerCase()
    );

    // Ajouter en première position
    this.historique.unshift(ville);

    // Maximum 5 villes
    this.historique = this.historique.slice(0, 5);

    // Sauvegarder dans le navigateur
    localStorage.setItem(
      'historique',
      JSON.stringify(this.historique)
    );

  }

  /**
   * Cliquer sur une ville de l'historique
   */
  rechercherDepuisHistorique(ville: string) {

    this.rechercherVille(ville);

  }

  /**
   * Vider l'historique
   */
  viderHistorique() {

    this.historique = [];

    localStorage.removeItem('historique');

  }

}