import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, lastValueFrom } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { API_URL } from '../utils/constants';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private authStatusEndpoint = API_URL + "/check"
  private logoutEndpoint = API_URL + '/logout'

  constructor(private http: HttpClient, private userService: UserService) { }

  setLoggedIn(value: boolean): void {
    this.loggedIn.next(value);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  checkLoginStatus(): Observable<boolean> {
    return this.http.get<{
      email?: string;
      id?: string;
      name?: string;
      picture?: string;
    }>(this.authStatusEndpoint, { withCredentials: true })
      .pipe(
        map(response => {
          console.log(response)
          if (response.email !== undefined && response.name !== undefined && response.picture !== undefined) {
            this.userService.setUser({
              id: '',
              email: response.email,
              name: response.name,
              picture: response.picture
            });
            localStorage.setItem('userEmail', response.email);
            localStorage.setItem('userName', response.name);
           
            localStorage.setItem('picture', response.picture); console.log(localStorage.getItem('picture'))
          }
          this.loggedIn.next(!!response.email);
          return !!response.email;
        })
      );
  }

  logout(): Observable<any> {

    return this.http.post(this.logoutEndpoint, null, { withCredentials: true }).pipe(
      tap(() => {

        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('picture');
        this.loggedIn.next(false);
      })
    );
  }

}