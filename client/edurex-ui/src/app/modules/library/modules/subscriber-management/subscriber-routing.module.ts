import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriberManagementComponent } from './subscriber-management/subscriber-management.component';
import { RegisterSubscriberComponent } from './register-subscriber/register-subscriber.component';
import { SubscribersComponent } from './subscribers/subscribers.component';
import { SubscriberListComponent } from './subscriber-list/subscriber-list.component';



const routes = [
    {path : 'subscriber-management', component : SubscriberManagementComponent,
    children : [
        {path : 'register',component : RegisterSubscriberComponent},
        {path : 'categories', component : SubscribersComponent},
        {path : 'list/:cat', component : SubscriberListComponent},
        {path : '**', redirectTo : '/404'}
      ]
 },
 {path : '**', redirectTo : '/404'}
    
]

@NgModule({
    exports: [
      RouterModule,
    ],
    imports: [
      RouterModule.forChild(routes)
    ]
  })

  export class SubscriberRoutingModule { }