import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {WebsocketService} from "../services/websocket.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "./dialog/dialog.component";
import {CookieService} from "../services/cookie.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Client';

  constructor(private router: Router, private wss: WebsocketService, private dialog: MatDialog, private cookie: CookieService) {
    this.wss.incoming.subscribe((incoming) => {
      switch (incoming.event) {
        case 'Dialog':
          this.dialog.open(DialogComponent, {data: {msg: incoming.data.msg}});
          break;
        case 'Login':
          this.cookie.setCookie({name: 'uuid', value: incoming.data.uuid, expire: incoming.data.expire});
          this.cookie.setCookie({name: 'sid', value: incoming.data.sid, expire: incoming.data.expire});
          break;
      }
    });
  }
}
