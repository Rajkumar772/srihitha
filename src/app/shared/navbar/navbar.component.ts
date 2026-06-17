import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/core/services/login.service';
import Swal from 'sweetalert2';
import { SidebarService } from '../sidebar/sidebar.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
currentDate = new Date();
currentTime: string = '';

private timeInterval: any;
name: string;

constructor(public sidebarservice: SidebarService, private loginService: LoginService,private router:Router) {
    this.name = localStorage.getItem('usr_nm')
    this.rotate()
}

toggleSidebar() {
    this.sidebarservice.setSidebarState(!this.sidebarservice.getSidebarState());
}

getSideBarState() {
    return this.sidebarservice.getSidebarState();
}

hideSidebar() {
    this.sidebarservice.setSidebarState(true);
}

ngOnInit() {
this.updateTime();

this.timeInterval = setInterval(() => {
    this.updateTime();
}, 1000);
    /* Search Bar */
    $(document).ready(function () {
     $(".mobile-search-icon").on("click", function () {
        $(".search-bar").addClass("full-search-bar")
     }),
        $(".search-close").on("click", function () {
         $(".search-bar").removeClass("full-search-bar")
        })
    });
    

}

updateTime() {
const now = new Date();
this.currentDate = now;
this.currentTime = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
});
}

ngOnDestroy(): void {
if (this.timeInterval) {
    clearInterval(this.timeInterval);
}
}
logoutAlert() {
    Swal.fire({
     title: 'Do You Want to Logout',
     text: "You won't be able to revert this!",
     icon: 'warning',
     showCancelButton: true,
     confirmButtonColor: '#3085d6',
     cancelButtonColor: '#d33',
     confirmButtonText: 'Yes, Do it!'
    }).then((result) => {
     if (result.isConfirmed) {
        this.logout();
     }
    })
}

logout() {
    this.loginService.logout();
}



hrs: any;
mins: any;
secs: any;
id: any;

// displayTime() {
// var dateTime = new Date();
// this.hrs = dateTime.getHours();
// this.mins = dateTime.getMinutes();
// this.secs = dateTime.getSeconds();

// if (this.hrs < 10) {
//     this.hrs = '0' + this.hrs;
// }

// if (this.mins < 10) {
//     this.mins = '0' + this.mins;
// }

// if (this.secs < 10) {
//     this.secs = '0' + this.secs;
// }
// }


// rotate(){
// this.id = setInterval(() => {
//     this.displayTime();
// },10);
// }


hours: any;
time: any;
minutes: any;
seconds: any;
ampm: any;

displayTime() {
    var dateTime = new Date();
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var seconds = dateTime.getSeconds();

    // Convert hours to 12-hour format
    this.ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Add leading zeros if necessary
    this.hours = hours < 10 ? hours : hours;
    this.minutes = minutes < 10 ? '0' + minutes : minutes;
    this.seconds = seconds < 10 ? '0' + seconds : seconds;

    this.time = hours + ':' + minutes + ':' + seconds + ' ' + this.ampm;

}

rotate() {
    this.id = setInterval(() => {
     this.displayTime();
    }, 1000); // Update every second
}



toggleFullScreen() {
    if (!document.fullscreenElement) {
     document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
     });
    } else {
     document.exitFullscreen();
    }
}
naviagatetobooking() {
    this.router.navigate(['/dashboard/analysis']);
}
}
