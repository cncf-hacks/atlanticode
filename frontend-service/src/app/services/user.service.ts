import { Injectable } from '@angular/core';
import { User } from '../lib/interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User | null = null;

  constructor() {}


  setUser(user: User): void {
    console.log('user was set')
    this.user = user;
  }

  getUser(): User | null {
    return this.user;
  }

  clearUser(): void {
    this.user = null;
  }
}
