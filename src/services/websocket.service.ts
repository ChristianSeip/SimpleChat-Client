import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

export interface IncomingMessage {
  event: string;
  data: any;
}

export interface OutgoingMessage {
  event: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  /**
   * Emit the deserialized incoming messages.
   */
  readonly incoming = new Subject<IncomingMessage>();

  private buffer: OutgoingMessage[] | undefined;
  private socket: WebSocket | undefined;
  private intval: any;
  private reconnectCount: number = 0;

  constructor() {
    this.connect();
  }

  /**
   * Start the websocket connection.
   */
  connect(): void {
    this.socket = new WebSocket('wss://localhost:3000');
    this.buffer = [];
    this.socket.addEventListener('message', this.onMessage);
    this.socket.addEventListener('open', this.onOpen);
    this.socket.addEventListener('close', this.onClose);
    this.socket.addEventListener('error', this.onError);
  }

  /**
   * Stop the websocket connection.
   */
  disconnect(): void {
    if (!this.socket) {
      throw new Error('There is no connection to the server.');
    }
    this.socket.removeEventListener('message', this.onMessage);
    this.socket.removeEventListener('open', this.onOpen);
    this.socket.removeEventListener('close', this.onClose);
    this.socket.removeEventListener('error', this.onError);
    this.socket.close();
    this.socket = undefined;
    this.buffer = undefined;
  }

  /**
   * Send message to websocket server.
   *
   * @param msg
   */
  send(msg: OutgoingMessage): void {
    if (!this.socket) {
      throw new Error('Message could not be sent. There is no connection to the server.');
    }
    if (this.buffer) {
      this.buffer.push(msg);
    } else {
      this.socket.send(JSON.stringify(msg));
    }
  }

  private onMessage = (event: MessageEvent): void => {
    const msg = JSON.parse(event.data);
    this.incoming.next(msg);
  };

  private onOpen = (event: Event): void => {
    const buffered = this.buffer;
    if (!buffered) {
      return;
    }
    this.buffer = undefined;
    for (const msg of buffered) {
      this.send(msg);
    }
  };

  private onError = (event: Event): void => {
    console.error('A connection error has occurred.', event);
    let msg = 'A connection error has occurred. '
    msg += this.reconnectCount < 3 ? 'We\'ll try to reconnect you in 10 seconds.' : 'It was not possible to reconnect.';
    this.incoming.next({event: 'Dialog', data: {msg: msg}});
  };

  private onClose = (event: CloseEvent): void => {
    console.info('Connection closed.', event);
    if(!this.intval) {
      this.intval = setInterval(() => {
        this.connect()
        this.reconnectCount++;
      }, 10000);
    }
    if(this.reconnectCount == 3) {
      clearInterval(this.intval);
    }
  };
}
