import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './account.component';
import { AdminComponent } from './admin/admin.component';
import { AgentComponent } from './agent/agent.component';
import { EndUserComponent } from './end-user/end-user.component';

const routes: Routes = [
  {
    path: '', component: AccountComponent, data: { title: 'Detect'},
    children: [ 
      { path: '',redirectTo: 'end-user'},
      { path: 'admin',component: AdminComponent},
      { path: 'agent',component: AgentComponent},
      { path: 'end-user',component: EndUserComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
