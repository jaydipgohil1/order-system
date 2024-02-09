import { AuthInterceptor } from './interceptor/auth-interceptor';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './not-found-component/not-found-component.component';
import { HomeComponent } from './home/home.component';
import { HttpErrorInterceptor } from './interceptor/error-handling-interceptor';
import { UsersComponent } from './users/users.component';
import { MaterialModule } from './material/material.module';
import { CategoryComponent } from './category/category.component';
import { DeleteDialogComponent } from 'src/shared/common/delete-dialog/delete-dialog.component';
import { ProductComponent } from './product/product.component';
import { IDialogComponent } from 'src/shared/common/i-dialog/i-dialog.component';
import { AddUpdateProductComponent } from './product/add-update-product/add-update-product.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    DashboardComponent,
    ProfileComponent,
    NotFoundComponent,
    HomeComponent,
    UsersComponent,
    CategoryComponent,
    ProductComponent,
    AddUpdateProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MaterialModule,
    DeleteDialogComponent,
    IDialogComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
