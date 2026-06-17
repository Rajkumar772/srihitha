import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';
@Component({
  selector: 'app-videocall',
  templateUrl: './videocall.component.html',
  styleUrls: ['./videocall.component.scss']
})
export class VideocallComponent   {
 @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  socket!: Socket;

  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection;

  roomId: string = '';

  // ✅ Use public STUN server
  private rtcConfig: RTCConfiguration = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  };

  ngOnInit(): void {
    // ✅ connect socket
    this.socket = io('http://localhost:1717', {
      transports: ['websocket', 'polling'] // ✅ avoid 404 / fallback issues
    });

    this.socket.on('connect', () => {
     
    });

    this.socket.on('connect_error', (err) => {
      
    });

    // ✅ Handle signalling events
    this.socket.on('offer', async (data: any) => {
      
      await this.createPeerConnection();

      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);

      this.socket.emit('answer', { roomId: this.roomId, answer });
    });

    this.socket.on('answer', async (data: any) => {
      
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    this.socket.on('ice-candidate', async (data: any) => {
      
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
      } catch (err) {
        
      }
    });
  }

  /** ✅ Start camera+mic */
  async startCamera() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = this.localStream;
    } catch (err) {
    

      // fallback: audio only
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      this.localVideo.nativeElement.srcObject = this.localStream;
    }
  }

  /** ✅ Join room */
  async joinRoom(room: string) {
    this.roomId = room;

    if (!this.localStream) {
      await this.startCamera();
    }

    await this.createPeerConnection();

    this.socket.emit('join-room', this.roomId);
    
  }

  /** ✅ Create call (Doctor starts offer) */
  async startCall() {
    if (!this.peerConnection) {
      await this.createPeerConnection();
    }

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.socket.emit('offer', { roomId: this.roomId, offer });
   
  }

  /** ✅ PeerConnection */
  private async createPeerConnection() {
    if (this.peerConnection) return;

    this.peerConnection = new RTCPeerConnection(this.rtcConfig);

    // ✅ send ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.emit('ice-candidate', { roomId: this.roomId, candidate: event.candidate });
      }
    };
    this.peerConnection.ontrack = (event) => {
      
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };

    // ✅ add local tracks
    this.localStream.getTracks().forEach(track => {
      this.peerConnection.addTrack(track, this.localStream);
    });
  }
  ngOnDestroy(): void {
    try {
      this.socket?.disconnect();
      this.peerConnection?.close();
      this.localStream?.getTracks()?.forEach(t => t.stop());
    } catch {}
  }
}
