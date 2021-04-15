import { Injectable } from '@angular/core';
import { LocalStorageService } from '../services/local-storage.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate{

  constructor(
    private _router: Router, private localStorageService : LocalStorageService,
    )
{

}
canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : boolean
{
    const loggeinUser  = this.localStorageService.getter('user');
    if(!loggeinUser)
    {
        return true;
    }
    else
    {
        this._router.navigateByUrl('/e-library/home');
        return false;
    }
}
}
