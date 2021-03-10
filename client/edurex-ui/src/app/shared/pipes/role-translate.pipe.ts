import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'roleTranslate'})
export class RoleTranslatePipe implements PipeTransform {
  transform(value: string): string {
    if(value == 'SADMIN')
    {
        return "SYSTEM ADMIN";
    }
    if(value == "IADMIN")
    {
        return "INSTITUTE ADMIN";
    }
    if(value == 'CADMIN')
    {
        return "CONTENT ADMIN";
    }
   if(value == 'CSADMIN')
    {
        return "COURSE INSTRUCTOR";
    }
    if(value == 'QADMIN')
    {
        return "ASSESSMENT ADMIN";
    }
    if(value == 'STUDENT')
    {
         return "STUDENT";
    }
  }
}
