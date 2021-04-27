import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { SubscriberService } from '../../service/subscriber.service';



@Injectable()
export class ProfileGuradService implements CanActivate
{
    constructor(
        private _router: Router, private localStorageService : LocalStorageService,
        private subscriberService : SubscriberService)
    {

    }
    canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : boolean
    {
      const loggedinUserId = route.paramMap.get('user_id');
      const view_mode = route.paramMap.get('view');

      if(view_mode != 'self' && view_mode != 'public')
      {
          this._router.navigateByUrl('/404');
          return false;

      }
      if(loggedinUserId != this.localStorageService.getter('user').user_id)
      {
          
       if(!this.subscriberService.get_subscriber_by_id(loggedinUserId))
           {
                this._router.navigateByUrl('/404');
                return false;
            }
        
      }
      if(loggedinUserId == this.localStorageService.getter('user').user_id && view_mode == 'self' )
      {
          return true;
      }
      else if(loggedinUserId == this.localStorageService.getter('user').user_id && view_mode == 'public')
      {
          this._router.navigateByUrl('/e-library/profile/self/'+loggedinUserId);
          return false;
      }
      else if(loggedinUserId != this.localStorageService.getter('user').user_id && view_mode == 'public')
      {
        return true;
      }
      else if(loggedinUserId != this.localStorageService.getter('user').user_id && view_mode == 'self')
      {
        this._router.navigateByUrl('/e-library/profile/public/'+loggedinUserId);
        return false;
      }
      

    }
}