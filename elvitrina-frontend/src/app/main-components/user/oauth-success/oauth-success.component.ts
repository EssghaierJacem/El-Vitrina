import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/core/services/user/TokenService';

@Component({
  selector: 'app-oauth-success',
  template: `<p class="text-center mt-5">Authenticating... Please wait.</p>`
})
export class OauthSuccessComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.tokenService.saveToken(token);

        const role = this.tokenService.getRole();
        if (role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.router.navigate(['/authentication/login']);
      }
    });
  }
}
