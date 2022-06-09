import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CookieService} from "../../../services/cookie.service";
import {WebsocketService} from "../../../services/websocket.service";
import {UserService} from "../../../services/user.service";
import {ChatmessageService} from "../../../services/chatmessage.service";
import {Router} from "@angular/router";
import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';
import {BreakpointObserver, BreakpointState} from "@angular/cdk/layout";

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
      })),
      state('closed', style({
        display: 'none'
      })),
      transition('open => closed', [
        animate("400ms", keyframes([
          style({ opacity: 1, transform: 'translateX(0)'}),
          style({ opacity: 0, transform: 'translateX(250px)'}),
        ]))
      ]),
      transition('closed => open', [
        animate("400ms", keyframes([
          style({ display: 'flex', opacity: 0, transform: 'translateX(250px)'}),
          style({ opacity: 1, transform: 'translateX(0)'}),
        ]))
      ]),
    ]),
  ],
})
export class ChatroomComponent implements OnInit {

  @ViewChild('chatMessageList') private chatMessageList: any;

  chatname: string = 'Welcome';
  inputMessage: string = '';
  messages: any = [];
  users: UserService[] = [];
  isOpen: boolean = true;
  width: number = 0;

  constructor(private cookie: CookieService, private wss: WebsocketService, private router: Router, private breakpointObserver: BreakpointObserver) {
    this.width = window.innerWidth;
    this.breakpointObserver.observe(["(max-width: 600px)"]).subscribe((result: BreakpointState) => {
      this.width = window.innerWidth;
      if(result.matches && this.isOpen) {
        this.toggle(true);
      }
    });
  }

  ngOnInit(): void {
    this.wss.incoming.subscribe((incoming) => {
      switch (incoming.event) {
        case 'InitChat':
          this.initChat(incoming.data);
          break;
        case 'UserJoined':
          this.addUser(incoming.data);
          break;
        case 'UserLeft':
          this.removeUser(incoming.data.uuid);
          break;
        case 'MessageReceived':
          this.addMessage(incoming.data);
          break;
      }
    });
    this.wss.send({event: 'Login', data: {id: this.cookie.getCookie('uuid'), key: this.cookie.getCookie('sid'), keyType: 'session'}});
    this.wss.send({event: 'JoinChannel', data: {uuid: this.cookie.getCookie('uuid'), sid: this.cookie.getCookie('sid')}});
  }

  /**
   * Scroll
   */
  scrollToEndOfChat(): void {
    this.chatMessageList.nativeElement.scroll({
      top: this.chatMessageList.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }

  /**
   * Destroy user session and redirect to login page.
   */
  logout() {
    this.wss.send({event: 'Logout', data: {uuid: this.cookie.getCookie('uuid'), sid: this.cookie.getCookie('sid')}});
    this.cookie.deleteCookie('uuid');
    this.cookie.deleteCookie('sid');
    this.router.navigate(['/login']);
  }

  /**
   * Add user to user list.
   *
   * @param data
   */
  addUser(data: any) {
    this.removeUser(data.uuid);
    let u = new UserService();
    u.uuid = data.uuid;
    u.username = data.username;
    u.setAge(data.age);
    u.setLastActivity(data.lastActivity);
    this.users.push(u);
  }

  /**
   * Remove user from user list.
   *
   * @param uuid
   */
  removeUser(uuid: string) {
    for(let i = 0; i < this.users.length; i++) {
      if(this.users[i].uuid === uuid) {
        this.users.splice(i, 1);
      }
    }
  }

  /**
   * Add message to message list.
   *
   * @param data
   */
  addMessage(data: any) {
    let m = new ChatmessageService();
    m.text = data.msg;
    m.username = data.username;
    m.uuid = data.uuid;
    m.time = parseInt(data.timestamp);
    m.type = data.type;
    this.messages.push(m);
    setTimeout(() => this.scrollToEndOfChat(), 0);
  }

  /**
   * Send message to server.
   */
  sendMessage() {
    if(this.isValidMessage()) {
      this.wss.send({
        event: 'SendMessage',
        data: {
          uuid: this.cookie.getCookie('uuid'),
          sid: this.cookie.getCookie('sid'),
          msg: this.inputMessage,
        }
      });
      this.inputMessage = '';
    }
  }

  /**
   * Check if input message is valid.
   */
  isValidMessage(): boolean {
    return this.inputMessage.length >= 1 && this.inputMessage.length <= 1000;
  }

  /**
   * Init chat channel.
   *
   * @param data
   */
  initChat(data: any) {
    this.users = [];
    this.chatname = data.channelname;
    data.users.forEach((item: any) => {
      this.addUser(item);
    });
  }

  toggle(force: boolean) {
    if(!force && this.width > 600) {
      return;
    }
    this.isOpen = !this.isOpen;
  }
}
