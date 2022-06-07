import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingComponent} from "./pages/landing/landing.component";
import {ChatroomComponent} from "./pages/chatroom/chatroom.component";

const routes: Routes = [
  {path: 'login', component: LandingComponent},
  {path: 'register', component: LandingComponent},
  {path: '', redirectTo: 'register', pathMatch: 'full'},
  {path: 'chatroom/:id', component: ChatroomComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
