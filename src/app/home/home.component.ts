import { SharedService } from './../services/shared.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(
    private sharedService: SharedService) {
    this.sharedService.setIsAuthentic('Home');
  }
}
