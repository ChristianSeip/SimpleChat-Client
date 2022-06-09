import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  uuid: string = '';
  username: string = '';
  #age: number = -1;
  #lastActivity: number = -1;

  constructor() {
  }

  /**
   * Get age of user.
   */
  getAge() {
    return this.#age;
  }

  /**
   * Set users age as number.
   *
   * @param {string|number} age
   */
  setAge(age: string|number) {
    if(typeof age === 'string') {
      age = parseInt(age);
    }
    this.#age = age;
  }

  /**
   * Set users last activity timestamp.
   *
   * @param {{string|number}} timestamp
   */
  setLastActivity(timestamp: string|number) {
    if(typeof timestamp === 'string') {
      timestamp = parseInt(timestamp);
    }
    this.#lastActivity = timestamp;
  }

  /**
   * Get last activity. Use format to decide if you want a formatted date or the timestamp.
   *
   * @param {boolean} format
   */
  getLastActivity(format:boolean = false) {
    if(format) {
      let date = new Date(this.#lastActivity);
      return date.toLocaleDateString('de-DE');
    }
    return this.#lastActivity;
  }

}
