import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatmessageService {

  text: string = '';
  username: string = '';
  uuid: string = '';
  time: number = 0;
  type: string = '';

  constructor() {
  }

  /**
   * Get formatted message.
   */
  getMessage() {
    let msg = this.username;
    if(this.type === 'PublicMessage' || this.type === 'PrivateMessage') {
      msg += ':';
    }
    msg += ` ${this.text}`;
    return msg;
  }

  /**
   * Get css class name for this message.
   */
  getMessageClass() {
    switch (this.type) {
      case 'SystemMessage':
        return 'system-message';
      default:
        return 'default-message';
    }
  }
}
