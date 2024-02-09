import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './not-found-component/not-found-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { UsersComponent } from './users/users.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard], },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard], },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard], },
  { path: 'product', component: ProductComponent, canActivate: [AuthGuard], },
  { path: 'sign-up', component: SignupComponent },
  { path: 'log-in', component: LoginComponent },
  { path: '**', component: NotFoundComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
