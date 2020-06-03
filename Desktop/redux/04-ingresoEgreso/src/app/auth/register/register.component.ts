import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

 regristroForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router ) { }

  ngOnInit() {

    this.regristroForm = this.fb.group({ 
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email] ],
      password: ['', Validators.required],
    });
  }

  crearUsuario(){
    
    if ( this.regristroForm.invalid ) { return; }


    Swal.fire({
      title: 'Auto close alert!',
      onBeforeOpen: () => {
        Swal.showLoading()
    }});


    const { nombre, correo, password } = this.regristroForm.value;
    this.authService.createUsuario( nombre, correo, password )
    .then( credenciales => {
      console.log( credenciales );
      Swal.close();
      this.router.navigate(['/']);
    })
    .catch( err => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
      })
    } );

  }

}
