import { HttpClient } from '@angular/common/http';
import { HtmlParser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { UsuarioModel } from '../models/Usuario.models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
 //Crear usuario
export class AuthService {
  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apiKey = 'AIzaSyCvIrRkxmOisjgFshsibkaQr9OXMLJxqzc';
  
  userToken : string;
  constructor(private http: HttpClient) { 
    this.leerToken();
  }
  logout(){
    localStorage.removeItem('token');
  }
  //Iniciar sesion
  login(usuario: UsuarioModel){
    const authData={
      ...usuario,
      returnSecureToken : true 
     };
     return this.http.post(
       `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`, authData
       ).pipe(
        map(
          resp => {
            this.guardarToken(resp['idToken']);
            return resp;
          }
        )
       );
  }

  nuevoUsuario( usuario:UsuarioModel ){
    const authData = {
      ...usuario,
      returnSecureToken : true
    };
    return this.http.post(
      `${this.url}/accounts:signUp?key=${this.apiKey}`,
      authData
    ).pipe(
      map( resp => {
        this.guardarToken(resp['idToken']);
        return resp;
      })
    );
  }


  private guardarToken(idToken : string){
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    let hoy = new Date();
    hoy.setSeconds( 3600 );
    localStorage.setItem('expira',hoy.getTime().toString());
  }

  private leerToken(){
    if (localStorage.getItem('token')){
      this.userToken = localStorage.getItem('token');
    }else{
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado() : boolean{

    if (this.userToken.length<2){
      return false;
    }
    
    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()){
      return true;
    }else{
      return false;
    }
  }


}
