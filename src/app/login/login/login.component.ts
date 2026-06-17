import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { LoginService } from 'src/app/core/services/login.service';
import { take, map } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showOTPForm = false;
   timer$: Observable<number>;
   loginForm: FormGroup;
   submitted: boolean = false; 
   error: string = ''; 
   returnUrl: string; 
   public showPassword: boolean = false; 
   intialvalues: any;
   otpget: boolean = false;
   refresh: boolean = false; 
   time: any;
   showOverlay: boolean = false; 
   loginForms: FormGroup;
 
   @ViewChild('captchaRef') captchaRef: any;
   checkboxChecked: boolean = false;
 
   constructor(private router: Router,  private formBuilder: FormBuilder, private loginservice: LoginService) { }
   showPasswordForm = true;
   toggleForms() {
     this.showPasswordForm = !this.showPasswordForm;
   }
   ngOnInit(): void {
     this.loginForm = this.formBuilder.group({
       phone: ['', [Validators.required]],
       usr_pwd: ['', [Validators.required]],
       rememberme: [false, [Validators.required]],
 
 
     });
     this.intialvalues = this.loginForm.value;
     this.loginForms = this.formBuilder.group({
       phone: ['', [Validators.required]],
       usr_pwd: ['', [Validators.required]],
       rememberme: ['']
     });
     this.intialvalues = this.loginForms.value;
   }
 
   get f() { return this.loginForm.controls; }
   numericOnly(event): boolean {
     let patt = /^([0-9])$/;
     let result = patt.test(event.key);
     return result;
   }
 
   getOtp() {
     this.submitted = true;
     if (this.f['phone'].invalid) {
       return;
     }
     this.showOverlay = true;
     var data = {
       number: this.loginForm.value.phone
     }
     this.loginservice.getdashotp(data).subscribe(response => {
       this.showOverlay = false;
       if (response.status == 200) {
         this.otpget = true;
         this.startTimer(30);
       } else if (response.status == 601) {
         this.loginservice.errorMessageAlert(response.errors)
       }
       else if (response.status == 429) {
         this.onResetpassword2()
         this.loginservice.errorMessageAlert(response.message)
       }
       else {
         this.loginservice.errorMessageAlert('Please Enter Valid Mobile Number')
       }
       this.submitted = false;
     }, error => {
       this.showOverlay = false;
     })
   }
 
   startTimer(counter: number) {
     this.refresh = false;
     this.timer$ = timer(0, 1000).pipe(take(counter), map(_ => --counter,));
     this.time = setTimeout(() => {
       this.refresh = true;
     }, 30000);
   }
   //  Form submit
 
   onResetpassword2() {
     this.otpget = false;
     this.loginForm.reset(this.intialvalues);
     clearTimeout(this.time)
 
   }
   test() {
 
   }
 
   onSubmit() {
     this.submitted = true;
     if (this.loginForm.invalid) {
       return;
     } else {
       this.loginservice.login(this.loginForm.value).subscribe(data => {
         if (Array.isArray(data) && data.length) {
           Swal.fire({
             icon: 'success', // Icon for success message
             text: 'Login Success', // Message text
             showConfirmButton: false, // Hide the confirmation button
             timer: 1500 // Automatically close after 1.5 seconds
           });
           this.router.navigate([data[0].submenu[0].path]);
         }
       },
         error => {
           this.error = error ? error : '';
         });
     }
   }
 
   onSubmit1() {
     this.submitted = true;
     if (this.loginForms.invalid) {
       return;
     } else {
       this.loginservice.login1(this.loginForms.value).subscribe(
         data => {
           if (Array.isArray(data) && data.length) {
             Swal.fire({
               position: 'top-end',
               icon: 'success',
               text: 'Login Success',
               showConfirmButton: false,
               timer: 1500
             });
             this.router.navigate([data[0].submenu[0].path]);
           }
         },
         error => {
           this.error = error ? error : '';
         });
       this.submitted = false;
     }
   }
   passwordFieldType: 'raju' | 'text' = 'raju';
 
   togglePasswordVisibility() {
     this.passwordFieldType = this.passwordFieldType === 'raju' ? 'text' : 'raju';
   }
 }
 
 