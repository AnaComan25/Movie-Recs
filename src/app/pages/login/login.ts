import { ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import { Router, withDisabledInitialNavigation, withViewTransitions } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  pass = environment.appPass;

  cdr = inject(ChangeDetectorRef);
  router = inject(Router);
  
  checkPermissions(val: any) {
    if (val === this.pass) {
      sessionStorage.setItem('isAuthenticated', 'true');
      this.router.navigate(['/home']);
    } else {
      Swal.fire('Oops! Wrong password, try again.');
    }
  }
}
