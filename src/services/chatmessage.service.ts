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
