import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { AuthService } from './@core/service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private authService: AuthService
    ) {
      this.initializeApp();
    }

  initializeApp() {
    this.platform.ready();
  }

  onLogOut() {
    this.authService.logout();
  }
}
