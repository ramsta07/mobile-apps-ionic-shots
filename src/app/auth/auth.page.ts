import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../@core/service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isActiveToggleTextPassword = true;
  error: string;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private route: Router) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const username = form.value.username;
    const password = form.value.password;

    this.loadingCtrl
        .create({keyboardClose: true, message: 'Authenticating...'})
        .then(loadingEl => {
          loadingEl.present();
          this.authService.login(username + '@test.com', password).then(res => {
            loadingEl.dismiss();
            form.reset();
            this.route.navigate(['/navtabs/tabs/dashboard/']);
          }).catch(error => {
            loadingEl.dismiss();
            this.handleError(error.code);
            this.alertCtrl.create({
              header:  'Authentication Error',
              message: this.error,
              buttons: ['Okay']
            }).then(alertEl => {
              alertEl.present();
            });
          });
        });

  }

  handleError(code: string) {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        this.error = 'Login attempt failed: Unrecognised details.';
        break;
      case 'auth/user-disabled':
        this.error = 'Account deactivated. If you wish to reactivate, please contact support.';
        break;
      case 'auth/invalid-email':
        this.error = 'Login attempt failed: Invalid email address';
        break;
      case 'auth/too-many-requests':
        this.error = 'Hmmm... Too many attempts have been made. Please confirm your are not a bot.';
        // this.presentCaptcha();
        break;
      default:
        this.error = 'An unknown error has occurred! Very Likely, the cause is rebellious monkeys.';
    }
  }

  public toggleTextPassword(): void {
    this.isActiveToggleTextPassword = (this.isActiveToggleTextPassword === true) ? false : true;
  }

  public getType() {
      return this.isActiveToggleTextPassword ? 'password' : 'text';
  }

}
