import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.serice';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver,
    public authService: AuthService) {}

    ngOnInit(){
      if (localStorage.getItem("develop-login")) {
        this.authService.loggedIn = true;
      }
    }

    logout() {
      this.authService.loggedIn = false;
      localStorage.removeItem("develop-login");
    }

    createProfile() {
      let form = {
        email: 'vidya@developindia.com',
        password: 'vidyadevelopindia'
      }
      let auths;
      this.authService.getAuths().subscribe(data => {
        auths = data
        let authExists = false;
        console.log('Recieved auths in header')
        for (let auth of auths) {
          if (auth.email === form.email && auth.password === form.password) {
            authExists = true;
            break;
          }
        }
        if (!authExists) {
          this.authService.onPostAuth(form);
        }
      },
        error => console.log("error getting auths", error));
  
    }

}