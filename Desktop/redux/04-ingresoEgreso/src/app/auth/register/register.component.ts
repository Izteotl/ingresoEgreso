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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

 regristroForm: FormGroup;
 cargando: boolean = false;
 uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router ) { }

  ngOnInit() {

    this.regristroForm = this.fb.group({ 
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
    });

    this.uiSubscription = this.store.select('ui')
      .subscribe( ui => {
        this.cargando = ui.isLoading;
        console.log( 'cargando subs in register ');
      });
  }

  ngOnDestroy(){
    this.uiSubscription.unsubscribe();
  }

  crearUsuario(){
    
    if ( this.regristroForm.invalid ) { return; }


   /*  Swal.fire({
      title: 'Auto close alert!',
      onBeforeOpen: () => {
        Swal.showLoading()
    }}); */
    this.store.dispatch( ui.isLoading() );

    const { nombre, correo, password } = this.regristroForm.value;
    this.authService.createUsuario( nombre, correo, password )
    .then( credenciales => {
      console.log( credenciales );
      this.store.dispatch( ui.stopLoading() );
      //Swal.close();
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
