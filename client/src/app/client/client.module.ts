import { NgModule } from '@angular/core';

import { ClientRoutingModule } from './client-routing.module';
import { SharedModule } from '../shared';
import { DetailComponent } from './pages/detail/detail.component';

@NgModule({
  imports: [ClientRoutingModule, SharedModule],
  declarations: [
    DetailComponent
  ],
  providers: []
})
export class ClientModule {}
