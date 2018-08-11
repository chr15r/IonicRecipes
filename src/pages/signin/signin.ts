import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  onSignIn(form: NgForm) {
    console.log(form.value);
  }

}
