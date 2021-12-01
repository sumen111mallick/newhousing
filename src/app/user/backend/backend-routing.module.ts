import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MasterComponent } from './components/master/master.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { ListpropertyComponent } from './components/listproperty/listproperty.component';
import { ListpropertyRentComponent } from './components/listproperty-rent/listproperty-rent.component';
import { UpdatepropertyRentComponent } from './components/updateproperty-rent/updateproperty-rent.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { ListpropertySalesComponent } from './components/listproperty-sales/listproperty-sales.component';
import { UpdatepropertySalesComponent } from './components/updateproperty-sales/updateproperty-sales.component';
import { PaymentSummaryComponent } from './components/payment-summary/payment-summary.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { PlanApplyComponent } from './components/plan-apply/plan-apply.component';


const routes: Routes = [
  {
    path: "",
    component: MasterComponent,
    children: [
      { path: "", component:DashboardComponent,canActivate: [AuthGuard] },
      { path: "list-property", component: ListpropertyComponent,canActivate: [AuthGuard]},
      { path: "my-properties", component: MyPropertiesComponent,canActivate: [AuthGuard]},
      { path: "list-property-rent", component: ListpropertyRentComponent,canActivate: [AuthGuard]},
      { path: "list-property-sales", component: ListpropertySalesComponent,canActivate: [AuthGuard]},
      { path: "update-property-rent", component: UpdatepropertyRentComponent,canActivate: [AuthGuard]},
      { path: "payment-summary", component: PaymentSummaryComponent,canActivate: [AuthGuard]},
      { path: "invoice", component: InvoiceComponent,canActivate: [AuthGuard]},
      { path: "plan-apply", component: PlanApplyComponent,canActivate: [AuthGuard]},
      { path: "update-property-sales", component: UpdatepropertySalesComponent,canActivate: [AuthGuard]}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackendRoutingModule { }