import { Component, OnInit } from '@angular/core';
import {DialogComponent} from "../dialog/dialog.component";
import {WebsocketService} from "../../services/websocket.service";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  username: string = '';
  password: string = '';

  constructor(private router: Router, private wss: WebsocketService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.wss.incoming.subscribe((incoming) => {
        if(incoming.event === 'Login' && incoming.data.success) {
          this.router.navigate(['/chatroom', 1]);
        }
    });
  }

  isValidForm() {
    return this.username.length >= 1 && this.password.length >= 4;
  }

  login() {
    if(this.isValidForm()) {
      this.wss.send({
        event: 'Login',
        data: {id: this.username, key: this.password, keyType: 'password'},
      });
    }
  }

}
