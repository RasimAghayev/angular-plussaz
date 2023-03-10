import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListComponent } from './posts/list/list.component';
import { DetailComponent } from './posts/detail/detail.component';
import { EditComponent } from './posts/edit/edit.component';
import { HeaderComponent } from './companents/header/header.component';
import { FooterComponent } from './companents/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    DetailComponent,
    EditComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
