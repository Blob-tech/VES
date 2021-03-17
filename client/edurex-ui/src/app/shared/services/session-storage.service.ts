import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  getter(key : string)
  {
   
    if(sessionStorage.getItem(key) != null)
    {
      
      
      return JSON.parse(sessionStorage.getItem(key));
    }
    else
    {
      return null;
    }

  }

  setter(key : string, value : any)
  {
    
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}
