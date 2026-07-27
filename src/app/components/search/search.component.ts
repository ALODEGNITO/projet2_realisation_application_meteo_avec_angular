import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {

  ville = "Dakar";

  @Output()
  searchCity = new EventEmitter<string>();

  rechercher() {
    this.searchCity.emit(this.ville);
  }

}