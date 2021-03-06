import { Component, OnInit } from '@angular/core';
import {WebsocketService} from "../../services/websocket.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {

  username:string = '';
  usernameTooltip: string = '';
  password:string = '';
  age:number | null = null;
  readonly minAge = 18;
  readonly maxAge = 120;
  readonly minUsernameLength = 3;
  readonly maxUsernameLength = 15;
  readonly minPasswordLength = 4;
  readonly maxPasswordLength = 30;

  constructor(private router: Router, private wss: WebsocketService) { }

  ngOnInit(): void {
    this.wss.incoming.subscribe((incoming) => {
      if (incoming.event === 'NewUser' && incoming.data.success) {
        this.wss.send({event: 'Login', data: {id: this.username, key: this.password, keyType: 'password'}});
      }
      if(incoming.event === 'Login' && incoming.data.success) {
        this.router.navigate(['/chatroom']);
      }
      if(incoming.event === 'NameAvailabilityCheck' && !incoming.data.success) {
        this.usernameTooltip = 'This name is already taken.';
      }
    });
  }

  /**
   * Check if age is valid.
   */
  isValidAge(): boolean {
    return this.age !== null && this.age >= this.minAge && this.age <= this.maxAge;
  }

  /**
   * Check if username is available.
   */
  checkNameAvailability() {
    this.usernameTooltip = '';
    if(this.isValidUsername()) {
      this.wss.send({
        event: 'NameAvailabilityCheck',
        data: {username: this.username},
      });
    }
  }

  /**
   * Check is username is valid.
   */
  isValidUsername(): boolean {
    let regEx = new RegExp(`^[A-Za-z0-9]{${this.minUsernameLength},${this.maxUsernameLength}}$`);
    return regEx.test(this.username);
  }

  /**
   * Check if password is valid.
   */
  isValidPassword(): boolean {
    return this.password.length >= this.minPasswordLength && this.password.length <= this.maxPasswordLength;
  }

  /**
   * Check if registration form is valid.
   */
  isValidForm(): boolean {
    return this.isValidAge() && this.isValidUsername() && this.isValidPassword();
  }

  /**
   * Send form data to server.
   */
  sendForm() {
    if(this.isValidForm()) {
      this.wss.send({
        event: 'NewUser',
        data: {username: this.username, password: this.password, age: this.age},
      });
    }
  }
}
