// import { Component, OnInit } from '@angular/core';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleMeetService } from './../googlemeet.service';

@Component({
  selector: 'app-teleconsultancytesting',
  templateUrl: './teleconsultancytesting.component.html',
  styleUrls: ['./teleconsultancytesting.component.scss']
})
export class TeleconsultancytestingComponent implements OnInit {

  doctorId = 1; // TODO: set from logged-in doctor user (session/localStorage)
  patientEmail = '';
  title = 'Tele Consultation';
  description = '';
  date = '';      // yyyy-mm-dd
  startTime = ''; // HH:mm
  durationMin = 15;

  createdMeetLink: string | null = null;
  createdEventId: string | null = null;

  meetings: any[] = [];
  loadingMeetings = false;
  creatingMeeting = false;

  private msgHandler = (ev: MessageEvent) => {
    // When OAuth callback closes popup, it sends this message from backend callback HTML
    if (ev?.data?.type === 'GOOGLE_CONNECTED' && ev.data.doctorId === this.doctorId) {
      this.showToast('Google Calendar connected successfully ✅');
      this.loadMeetings();
    }
  };

  constructor(private api: GoogleMeetService) {}

  ngOnInit(): void {
    window.addEventListener('message', this.msgHandler);
    // Do not spam loadMeetings if server not running; but we keep it.
    this.loadMeetings();
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.msgHandler);
  }

  connectGoogle() {
    this.api.getAuthUrl(this.doctorId).subscribe({
      next: (r) => {
        // popup OAuth
        window.open(r.url, 'google_oauth', 'width=520,height=650');
      },
      error: (e) => {
        
        alert(this.getErrMsg(e, 'Failed to get auth url'));
      }
    });
  }

  createMeet() {
    // Basic validation
    if (!this.date || !this.startTime) {
      alert('Select date and start time');
      return;
    }
    if (!this.doctorId || Number.isNaN(+this.doctorId)) {
      alert('Doctor ID missing');
      return;
    }

    // Build start/end ISO
    const startISO = this.toISO(this.date, this.startTime);
    if (!startISO) {
      alert('Invalid date/time selected');
      return;
    }

    const endISO = new Date(new Date(startISO).getTime() + (Number(this.durationMin) || 15) * 60000).toISOString();

    const payload = {
      doctor_id: Number(this.doctorId),
      patient_email: this.patientEmail?.trim() ? this.patientEmail.trim() : undefined,
      title: this.title?.trim() ? this.title.trim() : 'Tele Consultation',
      description: this.description?.trim() ? this.description.trim() : '',
      startISO,
      endISO
    };

  

    this.creatingMeeting = true;
    this.api.createMeeting(payload).subscribe({
      next: (r) => {
        this.creatingMeeting = false;
        

        this.createdMeetLink = r?.meetLink || null;
        this.createdEventId = r?.eventId || null;

        if (!this.createdMeetLink) {
          this.showToast('Meeting created, but Meet link missing. Check Google permissions.');
        } else {
          this.showToast('Meeting created ✅');
        }

        this.loadMeetings();
      },
      error: (e) => {
        this.creatingMeeting = false;
        

        const msg = this.getErrMsg(e, 'Failed to create meeting');

        // ✅ If doctor not connected, prompt to connect
        if (msg.toLowerCase().includes('not connected')) {
          alert(msg + '\n\nPlease click "Connect Google Calendar" first.');
          return;
        }

        alert(msg);
      }
    });
  }

  openLink(url: string) {
    window.open(url, '_blank');
  }

  loadMeetings() {
    if (!this.doctorId || Number.isNaN(+this.doctorId)) return;

    this.loadingMeetings = true;

    const now = new Date();
    const timeMin = now.toISOString();
    const timeMax = new Date(now.getTime() + 7 * 86400000).toISOString();

    

    this.api.listMeetings(Number(this.doctorId), timeMin, timeMax).subscribe({
      next: (r) => {
        this.loadingMeetings = false;
       
        this.meetings = r?.items || [];
      },
      error: (e) => {
        this.loadingMeetings = false;
      

        const msg = this.getErrMsg(e, 'Failed to load meetings');
        // If not connected, keep meetings empty and show helpful message once
        if (msg.toLowerCase().includes('not connected')) {
          this.meetings = [];
          this.showToast('Connect Google Calendar to view meetings.');
          return;
        }

        this.meetings = [];
      }
    });
  }

  private toISO(dateYYYYMMDD: string, timeHHMM: string) {
    try {
      const [y, m, d] = dateYYYYMMDD.split('-').map(Number);
      const [hh, mm] = timeHHMM.split(':').map(Number);

      if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return '';

      // Local date-time -> ISO string (UTC)
      const dt = new Date(y, m - 1, d, hh, mm, 0);

      // Invalid date check
      if (isNaN(dt.getTime())) return '';

      return dt.toISOString();
    } catch {
      return '';
    }
  }
  private getErrMsg(e: any, fallback: string) {
    return e?.error?.message || e?.message || fallback;
  }
  private showToast(msg: string) {
    
  }

}
