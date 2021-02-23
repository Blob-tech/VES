import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable()
export class CommunicationService {
  // 1
  id: any;
   
   
  received: EventEmitter<any>;
  constructor() {
      this.received = new EventEmitter<any>();
  }
  // 2
  raiseEvent(id: any): Observable<any> {
      this.id = id;
      this.received.emit(id);
      return this.id;
  }
}