import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public auth: AngularFireAuth,
               private firestore: AngularFirestore,
               private store: Store<AppState> ) { }

  userSubscrition: Subscription;

  initAuthListener() {

    this.auth.authState.subscribe
      ( fuser => {
      console.log( fuser );
      if( fuser ){
        this.userSubscrition =  this.firestore.doc(`${ fuser.uid }/usuario`).valueChanges()
          .subscribe( (fireStoreUser: any) => {
            console.log({fireStoreUser});
            const user =  Usuario.fromFirebase( fireStoreUser );
            this.store.dispatch( authActions.setUser({ user }) );
          });
       
      }else{
        // no existe
        this.userSubscrition.unsubscribe();
        this.store.dispatch( authActions.unSetUser() );
      }
      
    
    });

  }

  createUsuario( nombre: string, email: string, password: string ) {

    return this.auth.createUserWithEmailAndPassword( email, password)
      .then( ({ user }) => {

        const newUser = new Usuario( user.uid, nombre, user.email );
        return this.firestore.doc(`${ user.uid }/usuario`)
          .set( { ...newUser } );
          
      })

  }

  logearUsuario( email: string, password: string) {
    return this.auth.signInWithEmailAndPassword( email, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }

}
