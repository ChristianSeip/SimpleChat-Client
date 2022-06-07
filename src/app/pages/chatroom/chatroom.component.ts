import { Component, OnInit } from '@angular/core';
import {CookieService} from "../../../services/cookie.service";
import {WebsocketService} from "../../../services/websocket.service";

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  constructor(private cookie: CookieService, private wss: WebsocketService) {
  }

  ngOnInit(): void {
    this.wss.incoming.subscribe((incoming) => {
      console.log(incoming);
    });
    this.wss.send({event: 'Login', data: {id: this.cookie.getCookie('uuid'), key: this.cookie.getCookie('sid'), keyType: 'session'}});
    this.wss.send({event: 'JoinChannel', data: {uuid: this.cookie.getCookie('uuid'), sid: this.cookie.getCookie('sid')}});
  }

}
