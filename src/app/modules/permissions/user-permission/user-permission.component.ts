import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent implements OnInit {
  permissions: any; hideselect1: boolean = false; headerclass1 = {
    'fontSize.px': 17,
    'fontWeight': '100',
    'backgroundColor': 'dodgerblue',
    'color': 'white'
  }; reset1: any = ''; clonedata1: any[] = []; masterdata1: any[] = []; vdvklistarr: MatTableDataSource<any>;
  @ViewChild('recPaginator', { read: MatPaginator }) recPaginator: MatPaginator;
  @ViewChild('rcrdSort') rcrdSort: MatSort; mainid: any; cust_color1: string = '#573474';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['no', 'name', 'number', 'module_nm', 'sub_menu', 'Action'];
  selectColumns: string[] = ['select0', 'select', 'select1', 'select3', 'select4']; userdetails: any; mastercheckname = "Check All"; mastercheckmodule: boolean = false
  report: any; user_id = 0; selectedmoduleslist = []; notselectedmoduleslist = []; totalmoduleslistarr = []; totalprojectlist = []; modulelistarr = [];
  addemployeedetails: FormGroup;
  submitted: boolean = false
  loadingpart: boolean = false;
  selectedRow: any;
  constructor(private formBuilder: FormBuilder, private permissionServ: PermissionService, private modalService: NgbModal) {
    this.getemployee();
    this.getemployeemodules(0)
  }

  ngOnInit(): void {
    this.addemployeedetails = this.formBuilder.group({
      name: ['', [Validators.required]],
      number: ['', [Validators.required]],
      email: [''],
      checkallmodules1: [''],
      checkallmodules: [''],
      check_sub_menu: [false]
    });
  }

  get f() {
    return this.addemployeedetails.controls
  }

  numericOnly(event: any): void {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  openusercreat(openpermission) {
    this.totalprojectlist.map(obj => {
      obj.submenu.map(obj2 => {
        return obj.checkallmodules = false, obj.checkallstatus = 'Check All', obj2.check_sub_menu = false;
      })
    })
    this.modalService.open(openpermission, { size: 'xl', centered: true });
  }

  toggleModules(row: any) {
    row.showAllModules = !row.showAllModules;
  }

  toggleSubMenus(row: any) {
    row.showAllSubMenus = !row.showAllSubMenus;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.permissions.filter = filterValue.trim().toLowerCase();
  }

  originalandtoggle(index) {
    if (index) {
      this.hideselect1 = !this.hideselect1;
    } else {
      this.hideselect1 = false;
      this.headerclass1['background-color'] = '#573474';
      this.reset1 = '';
    }
    this.clonedata1 = this.masterdata1;
    this.permissions = new MatTableDataSource(this.clonedata1);
    this.permissions.paginator = this.recPaginator;
    this.permissions.sort = null;
    this.permissions.sort = this.rcrdSort;
  }

  columnfilterdata1(object, index) {
    if (object == undefined) {
      this.clonedata1 = this.masterdata1;
      this.reset1 = '';
    } else {
      if (index == 0) {
        this.clonedata1 = this.clonedata1.filter(self => {
          return self[object.key] === object.value;
        })
      }
    }
    this.permissions = new MatTableDataSource(this.clonedata1);
  }

  changecolor(colorclass) {
    this.headerclass1['background-color'] = colorclass;
  }

  changeCustomColor(event) {
    this.cust_color1 = event.target.value;
    this.headerclass1['background-color'] = event.target.value;
  }

  getemployee() {
    this.permissionServ.userpermissionget().subscribe((Result: any) => {
      var id = 0;
      Result.data.map(respo => {
        respo.i = ++id;
      })
      if (Result.status == 200) {
        Result.data.map(obj => {
          var array1 = obj.module_nm.split(',');
          obj.module_nm = array1;

          var array2 = obj.sub_menu.split(',');
          obj.sub_menu = array2;
        })
        this.masterdata1 = Result.data;
        this.report = Result.data;
        this.permissions = new MatTableDataSource(Result.data);
        this.permissions.paginator = this.paginator;
        this.permissions.sort = this.sort;
      }
    })
  }


  editusermodules(usermoduleModel, userdata) {
    this.userdetails = "";
    this.userdetails = userdata;

    this.user_id = userdata.id
    this.getemployeemodules(userdata.id)
    this.modalService.open(usermoduleModel, { size: 'xl', centered: true });
  }

  updateuserpermissionlist(roll_usr_id) {
    this.selectedmoduleslist.map(obj => {
      obj.user_id = roll_usr_id;
    })
    const uniqueIds = [];
    const unique = this.selectedmoduleslist.filter(element => {
      const isDuplicate = uniqueIds.includes(element.id);
      if (!isDuplicate) {
        uniqueIds.push(element.id);
        return true;
      }
      return false;
    });
    if (this.selectedmoduleslist.length > 0) {
      this.permissionServ.submituserpermissions(unique).subscribe(resdata => {
        alert('Successfully Updated...!');
        this.getemployee();
        this.selectedmoduleslist = [];
        this.modalService.dismissAll();
      })
    } else {
      alert("Please Select Module list");
    }
  }


  getemployeemodules(event) {
    this.selectedmoduleslist = [];
    var user_id = event;
    this.permissionServ.getmodulelistdata(user_id).subscribe(resdata => {
      this.totalmoduleslistarr = resdata.data;
      this.totalprojectlist = [];
      this.totalprojectlist = Object.values(this.totalmoduleslistarr.reduce((r, o) => {
        if (o.check_sub_menu == true) {
          this.selectedmoduleslist.push(o);
        }

        r[o.module_id] = r[o.module_id] || {
          module_id: o.module_id, 'title': o.module_nm, 'icon': o.icon, 'class': "", 'path': o.path, 'badge': "", 'badgeClass': "", 'd_in': o.d_in, 'isExternalLink': 0, 'subcollopescnd': false, checkallstatus: 'Un Check All', checkallmodules: true, 'submenu': [], 'reportdata': []
        };
        r[o.module_id]['submenu'].push({ module_id: o.module_id, module_order: o.module_order, id: o.id, 'title': o.title, 'icon': o.icon, 'class': "", 'path': o.path, 'badge': "", 'badgeClass': "", 'd_in': o.d_in, 'isExternalLink': 0, 'subcollopescnd': false, checkallstatus: 'Un Check All', 'check_sub_menu': o.check_sub_menu, checkallmodules: true, submenu: [] });
        return r;
      }, {}));


      this.totalprojectlist.map(obj => {
        obj.submenu.map(obj2 => {
          if (obj2.check_sub_menu == false) {
            return obj.checkallmodules = false, obj.checkallstatus = 'Check All';

          } else {
            return obj
          }

        })
      })
      this.modulelistarr = resdata.data.filter((value, index, self) =>
        index === self.findIndex((t) => (
          t.module_id === value.module_id
        ))
      )
    })

  }

  submitemployeedata() {
    this.loadingpart = true;
    this.submitted = true;
    if (this.addemployeedetails.invalid) {
      alert("Please enter details");
    } else {
      if (this.selectedmoduleslist.length > 0) {
        this.permissionServ.addUsers(this.addemployeedetails.value).subscribe(resdata => {
          if (resdata.status == 200) {
            this.selectedmoduleslist.map(obj => {
              obj.user_id = resdata.data.insertId;
            })

            this.permissionServ.submituserpermissions(this.selectedmoduleslist).subscribe(resdata => {
              this.selectedmoduleslist = [];
              this.getemployee();
            })
            // this.selectedmoduleslist
            alert('Successfully Added...!');
            this.loadingpart = false;
            this.submitted = false
            this.addemployeedetails = this.formBuilder.group({
              name: ['', [Validators.required]],
              number: ['', [Validators.required]],
              email: [''],
              checkallmodules1: [''],
              checkallmodules: [''],
              check_sub_menu: [false]
            });
            this.modalService.dismissAll();
          } else if (resdata.status == 300) {
            alert('Mobile number already existed');
          } else {
            alert('Registration Fail');
          }

        })
      } else {
        alert("Please add at least one module");
      }
      this.addemployeedetails.reset();
    }
  }



  openprojectmodules(subcollopescnd, pdata) {
    if (subcollopescnd == true) {
      subcollopescnd = false;
    } else if (subcollopescnd == false) {
      subcollopescnd = true;
    }
    pdata.subcollopescnd = subcollopescnd;
  }
  mastercheckmoduledata(mastercheckmodule, totalprojectlist) {
    if (mastercheckmodule == true) {
      mastercheckmodule = false;
    }
    else if (mastercheckmodule == false) {
      mastercheckmodule = true;
    }
    if (mastercheckmodule == true) {
      if (this.selectedmoduleslist.length == 0) {
        this.selectedmoduleslist = totalprojectlist;
      }
      this.selectedmoduleslist.map(obj123 => {
        if (obj123.check_sub_menu == false) {
          obj123.check_sub_menu = true;
          // this.selectedmoduleslist.push(obj123);
        }
      })

      totalprojectlist.map(obj1 => {
        obj1.checkallmodules = true;
        obj1.checkallstatus = 'Un Check All';
        obj1.submenu.map(obj2 => {
          obj2.check_sub_menu = true;
        })
      })

      this.mastercheckname = 'Un Check All';
      this.mastercheckmodule = mastercheckmodule;
    } else if (mastercheckmodule == false) {

      this.selectedmoduleslist = [];

      totalprojectlist.map(obj1 => {
        obj1.checkallmodules = false;
        obj1.checkallstatus = 'Check All';
        obj1.submenu.map(obj2 => {
          obj2.check_sub_menu = false;
        })
      })

      this.mastercheckname = 'Check All';
      this.mastercheckmodule = mastercheckmodule;
      // projectdata.checkallstatus = 'Check All';
    }

  }

  checkallmoduledata(checkallmodules, projectmodules, projectdata) {
    if (checkallmodules == true) {
      checkallmodules = false;
    }
    else if (checkallmodules == false) {
      checkallmodules = true;
    }

    if (checkallmodules == true) {
      projectdata.submenu.map(obj123 => {
        if (obj123.check_sub_menu == false) {
          obj123.check_sub_menu = true;

          this.selectedmoduleslist.push(obj123);
        }

      })

      projectdata.checkallmodules = checkallmodules;
      projectdata.checkallstatus = 'Un Check All';
    } else if (checkallmodules == false) {
      var tepmcheckedmodule = [];
      var ccnt = 0;
      this.selectedmoduleslist.map(obj => {

        ccnt++;
        if (obj.module_id == projectdata.module_id) {
          projectdata.submenu.map(obj123 => {
            obj123.check_sub_menu = false;
          })
        } else {
          tepmcheckedmodule.push(obj);
        }
        if (ccnt == this.selectedmoduleslist.length) {
          this.selectedmoduleslist = [];
          this.selectedmoduleslist = tepmcheckedmodule;
        }
      })

      projectdata.checkallmodules = checkallmodules;
      projectdata.checkallstatus = 'Check All';
    }
  }


  selectedsubmodules(modulecnd, moduledetails, projectdata) {
    if (modulecnd == true) {
      modulecnd = false;
    } else if (modulecnd == false) {
      modulecnd = true;
    }
    if (modulecnd == true) {
      moduledetails.check_sub_menu = modulecnd;
      this.selectedmoduleslist.push(moduledetails);
      var mcnt = 0;
      var checkcnt = 0;
      projectdata.submenu.map(m => {
        mcnt++;
        if (m.check_sub_menu == false) {
          checkcnt = 1;

        }
        if (mcnt == projectdata.submenu.length && checkcnt == 0) {
          projectdata.checkallstatus = 'Un Check All';
          projectdata.checkallmodules = true;
        }
      })

    } else if (modulecnd == false) {

      moduledetails.check_sub_menu = modulecnd;
      this.selectedmoduleslist.map(m => {
        if (m.id == moduledetails.id) {
          var index = this.selectedmoduleslist.indexOf(m);
          this.selectedmoduleslist.splice(index, 1);
        }
      })
      projectdata.checkallstatus = 'Check All';
      projectdata.checkallmodules = false;
    }
  }


  deleteAlert(index) {
    Swal.fire({
      title: 'Are you sure to Delete User?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteUser(index);
      }
    })
  }

  deleteUser(index) {
    this.permissionServ.deleteUsers(index).subscribe(
      res => {
        this.getemployee();
      },
      error => {
      });
  }
  /** Open modules modal */
  openModulesModal(content: any, row: any): void {
    this.selectedRow = row;
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }

  openSubMenusModal(content: any, row: any): void {
    this.selectedRow = row;
    this.modalService.open(content, {
      centered: true,
      size: 'lg',
      backdrop: 'static'
    });
  }
}
