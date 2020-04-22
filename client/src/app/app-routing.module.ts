import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewComponent } from './view/view.component';
import { RoomComponent } from './components/room/room.component';


const routes: Routes = [
  { path: '', component: ViewComponent },
  { path: 'room/:id', component: RoomComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
