import { Component, OnInit } from '@angular/core';
import {CookieService} from "../../../services/cookie.service";

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  constructor(private cookie: CookieService) { }

  ngOnInit(): void {
    console.log(this.cookie.getCookie('uuid'));
    console.log(this.cookie.getCookie('sid'));
  }

}
