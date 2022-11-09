import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as Stomp from 'stompjs';

@Injectable({
  providedIn: 'root'
})
// This will get reviewed after configuring heroku to allow ws connections
export class StompService {
  // socket = new WebSocket(
  //   'ws://' + environment.base + '/order-websocket',
  //   localStorage.getItem('token')!);

  // stompClient = Stomp.over(this.socket);

  // subscribe(topic: string, callback: any): void {
  //   const connected: boolean = this.stompClient.connected;
  //   if (connected) {
  //     this.subscribeToTopic(topic, callback);
  //     return;
  //   }
  //   // if stomp client is not connected connect and subscribe to topic
  //   this.stompClient.connect({}, (frame): any => {
  //     this.subscribeToTopic(topic, callback);
  //   },
  //     (error) => {

  //     }
  //   );
  // }

  // private subscribeToTopic(topic: string, callback: any): void {

  //   this.stompClient.subscribe(topic, (message): any => {
  //     callback(message);
  //   })
  // }

}
