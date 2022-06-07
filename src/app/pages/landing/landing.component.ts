import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition,
  keyframes,
} from '@angular/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('init', [
      transition('start => end', [
        animate("400ms", keyframes([
          style({ transform: 'scale(0.5)'}),
          style({ transform: 'scale(1.0)'}),
        ]))
      ])
    ])
  ]
})
export class LandingComponent implements OnInit {

  init: boolean = true;
  form: string;

  constructor(private router: Router) {
    this.form = this.router.url.split('/')[1];
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.init = false;
  }

}
