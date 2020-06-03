import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private store: Store<AppState>,
               private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['',[ Validators.required, Validators.email ]],
      password: ['', [ Validators.required]]
    });
    this.uiSubscription = this.store.select('ui')
      .subscribe( ui => {
        this.cargando = ui.isLoading;
        console.log( 'Valor de UI =>');
        console.log( ui );
        console.log( this.cargando );
      });
  }

  ngOnDestroy(){
   // this.uiSubscription.unsubscribe();
  }

  firmarUsuario() {
    if ( this.loginForm.invalid ) { return; }
    
    this.store.dispatch( ui.isLoading() );

 /*    Swal.fire({
      title: 'Auto close alert!',
      onBeforeOpen: () => {
        Swal.showLoading()
    }}); */

    const { email, password } = this.loginForm.value;
    this.authService.logearUsuario( email, password )
    .then( credenciales => {
      console.log( credenciales );
      //Swal.close();
      this.store.dispatch( ui.stopLoading() );
      this.router.navigate(['/']);
    })
    .catch( err => {
      this.store.dispatch( ui.stopLoading() );
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    } );
  }


}
