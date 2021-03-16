import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';



@Injectable()
export class AuthGuradService implements CanActivate
{
    constructor(
        private _router: Router, private localStorageService : LocalStorageService,
        )
    {

    }
    canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : boolean
    {
        const loggeinUser  = this.localStorageService.getter('user');
        if(loggeinUser)
        {
            return true;
        }
        else
        {
            this._router.navigateByUrl('/login');
            return false;
        }
    }

}