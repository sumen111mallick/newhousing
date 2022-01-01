import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//custom componenent imports
import { MasterComponent } from './components/master/master.component';
import { IndexComponent } from './components/index/index.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import{ ProductListingComponent} from './components/product-listing/product-listing.component';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { CompareComponent } from './components/compare/compare.component';
import { ProPaymentSummaryComponent } from './components/pro-payment-summary/pro-payment-summary.component';
import { VerifyMobileComponent } from './components/verify-mobile/verify-mobile.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { MyPropertiesComponent } from './components/my-properties/my-properties.component';
import { AuthGuard } from './guards/auth.guard';
import { TermsConditionsComponent } from './components/terms-conditions/terms-conditions.component';
import { IpDisclaimerComponent } from './components/ip-disclaimer/ip-disclaimer.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { RegisterComponent } from './components/register/register.component';
import { PaymentSummaryComponent } from './components/payment-summary/payment-summary.component';
import { ProfileComponent } from './components/profile/profile.component';
import { LoginGuard } from './guards/login.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { BlogSinglePostComponent } from './components/blog-single-post/blog-single-post.component';
import { BlogComponent } from './components/blog/blog.component';
import { UserLogsGuard } from './guards/user-logs.guard';
//custom component imports

const routes: Routes = [
    {
      path: "",
      component: MasterComponent,
      children: [
        { path: "", component:IndexComponent,canActivate:  [UserLogsGuard]},
        { path: "about", component:AboutComponent,canActivate: [UserLogsGuard]},
        { path: "contact", component:ContactComponent,canActivate: [UserLogsGuard]},
        { path: "product-listing", component:ProductListingComponent,canActivate:[UserLogsGuard]},
        { path: "product-details", component:ProductPageComponent,canActivate:  [UserLogsGuard]},
        { path: "plans", component:SubscriptionPlansComponent,canActivate:  [UserLogsGuard]},
        { path: "login", component:LoginComponent},
        { path: "wishlist", component:WishlistComponent,canActivate: [AuthGuard]},
        { path: "product-compare", component:CompareComponent,canActivate: [AuthGuard]},
        { path: "terms-conditions", component:TermsConditionsComponent,canActivate:  [UserLogsGuard]},
        { path: "ip-disclaimer", component:IpDisclaimerComponent,canActivate:  [UserLogsGuard]},
        { path: "privacy-policy", component:PrivacyPolicyComponent,canActivate:  [UserLogsGuard]},
        { path: "logout", component:LogoutComponent,canActivate:  [UserLogsGuard]},
        { path: "product_payment_summary", component: ProPaymentSummaryComponent},
        { path: "verify-mobile", component: VerifyMobileComponent, canActivate: [AuthGuard,UserLogsGuard]},
        { path: "invoice", component: InvoiceComponent, canActivate: [AuthGuard]},
        { path: "my-properties", component: MyPropertiesComponent, canActivate: [AuthGuard]},
        { path: "register", component: RegisterComponent,canActivate:  [UserLogsGuard]},
        { path: 'agentregister', component: RegisterComponent,canActivate:  [UserLogsGuard]},
        { path: "payment-summary", component: PaymentSummaryComponent},
        { path: "profile", component: ProfileComponent, canActivate: [AuthGuard]},
        { path: "reset-password", component: ResetPasswordComponent },
        { path: 'blog-single-post/:slug', component: BlogSinglePostComponent,canActivate:  [UserLogsGuard]},
        { path: 'blog', component: BlogComponent,canActivate:  [UserLogsGuard] }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestRoutingModule { }
