import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { DietService } from '../diet.service';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.scss']
})
export class DietComponent{

 myformgroup!: FormGroup
  dietdata: any

  constructor(private fb: FormBuilder,private service:DietService) {
    this.myformgroup = this.fb.group({
      patientid: ['', Validators.required],
      wordroom: ['', Validators.required],
      patientname: ['', Validators.required],
      dietdate: ['', Validators.required],
      selectdiet: ['', Validators.required],
      allergies: ['', Validators.required],
      caloriesperday: ['', Validators.required],
      note: ['', Validators.required],
      breakfast: ['', Validators.required],
      lunch: ['', Validators.required],
      dinner: ['', Validators.required],
      snacks: ['', Validators.required],
    });
  }


  saveDietPlan(): void {
    
    if (this.myformgroup.valid) {
      this.service.dietplan({ data: this.myformgroup.value}).subscribe((res)=>{
        this.dietdata = res;
        this.myformgroup.reset()
      },(err)=> console.error(err))

    } else {
      
      this.myformgroup.markAllAsTouched();
    }
  }


  resetForm(): void {

  }

}
