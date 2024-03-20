import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ExecutorService } from 'src/app/services/executor.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy{
  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private userService : UserService, private executorService: ExecutorService) { }
  mobileMenuOpen = false;
  isLoggedIn: boolean = false;
  private subscription!: Subscription;
   userPicture = "../../../assets/defaultUser.png"
  name = 'there'
  ngOnInit() {
    this.subscription = this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (isLoggedIn) {
        const user = this.userService.getUser();
        if (user && user.picture) {
          this.userPicture = user.picture;
          this.name = user.name
        } 
      }
    });

    this.authService.checkLoginStatus().subscribe()
    const user = this.userService.getUser();
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  get menuIcon() {
    return this.mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7";
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  disconnect(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed', error);
      },
    });
  }

}
