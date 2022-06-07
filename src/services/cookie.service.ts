import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  public getCookie(name: string) {
    let ca: Array<string> = document.cookie.split(';');
    let caLen: number = ca.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }

  public setCookie(params: any) {
    params.expire = new Date(params.expire);
    document.cookie = `${params.name}=${params.value}; expires=${params.expire.toUTCString()};path=/`;
  }

  public deleteCookie(name: string) {
    this.setCookie({ name: name, value: '', expire: -1 });
  }
}
