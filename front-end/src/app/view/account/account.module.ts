import { NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountComponent } from './account.component';
import { AdminComponent } from './admin/admin.component';
import { AgentComponent } from './agent/agent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LanguageTranslationModule } from '../../module/language-translation.module';
import { NgxLoadingModule } from 'ngx-loading';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedComponentModule } from '../../shared-component/shared-component.module';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { AccountRoutingModule } from './account-routing.module';
import { EndUserComponent } from './end-user/end-user.component';
import { NgMultiSelectDropDownModule } from '../../module/ng-multiselect-dropdown/src';
import { AgentTableComponent } from './agent/agent-table/agent-table.component';
import { AgentUserListTableComponent } from './agent/agent-user-list-table/agent-user-list-table.component';
import { AlertModule } from 'ngx-bootstrap/alert';



@NgModule({
  declarations: [AccountComponent, AdminComponent, AgentComponent, EndUserComponent, AgentTableComponent, AgentUserListTableComponent],
  imports: [
    CommonModule,
    FormsModule,
    AccountRoutingModule,
    ReactiveFormsModule,
    LanguageTranslationModule,
    NgxLoadingModule.forRoot({}),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule,
    SharedComponentModule,
    ProgressbarModule,
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AccountModule { }
