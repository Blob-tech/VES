import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  getter(key : string)
  {
    if(localStorage.getItem(key) != null)
    {
      return JSON.parse(localStorage.getItem(key));
    }
    else
    {
      return null;
    }
  }

  setter(key : string, value : any)
  {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
