import { Routes } from '@angular/router';
import { MessagesPanelComponent } from './messages-panel/messages-panel.component';

export const routes: Routes = [
    { path: '**', redirectTo: '' },
    { path: '', component: MessagesPanelComponent }
];
