import { Injectable } from '@angular/core';
import { LocalService } from './local-storage';
const SecureLS = require('secure-ls');
const SECRET_KEY = 'Blobtech@Kolkata2103';
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor(private localService : LocalService) { }

  getter(key : string)
  {
    var ls = new SecureLS({encodingType : 'des' , isCompression : false, encryptionSecret : SECRET_KEY});
    //console.log(ls.get(key));
    if(localStorage.getItem(key) != null)
    {
      
      
      return JSON.parse(localStorage.getItem(key));
    }
    else
    {
      return null;
    }
    //return this.localService.getJsonValue(key);
  }

  setter(key : string, value : any)
  {
    //this.localService.setJsonValue('user', value);
    var ls=new SecureLS({encodingType : 'des' , isCompression : false, encryptionSecret : SECRET_KEY})
    //ls.set(key,JSON.stringify(value));
    localStorage.setItem(key, JSON.stringify(value));
  }
}
