import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'Rick & Morty Episodes',
  },
  {
    path: 'episode/:id',
    loadComponent: () =>
      import('./components/episode-detail/episode-detail.component').then(
        (m) => m.EpisodeDetailComponent
      ),
    title: 'Episode Detail',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
