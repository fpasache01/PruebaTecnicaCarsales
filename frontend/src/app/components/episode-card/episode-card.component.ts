import { Component, input, output } from '@angular/core';
import { Episode } from '../../models/episode.model';

@Component({
  selector: 'app-episode-card',
  standalone: true,
  template: `
    <article class="episode-card" (click)="selectEpisode.emit(episode())" tabindex="0" (keydown.enter)="selectEpisode.emit(episode())">
      <div class="episode-code">{{ episode().episodeCode }}</div>
      <h3 class="episode-name">{{ episode().name }}</h3>
      <p class="episode-air-date">
        <time>{{ episode().airDate }}</time>
      </p>
      <span class="episode-characters-count">
        {{ episode().characters.length }} character{{ episode().characters.length !== 1 ? 's' : '' }}
      </span>
    </article>
  `,
  styles: [`
    .episode-card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      transition: box-shadow 0.2s, transform 0.2s;
      background: #fff;
    }
    .episode-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }
    .episode-card:focus-visible {
      outline: 2px solid #4a90d9;
      outline-offset: 2px;
    }
    .episode-code {
      font-size: 0.875rem;
      font-weight: 600;
      color: #4a90d9;
      margin-bottom: 0.25rem;
    }
    .episode-name {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
      color: #222;
    }
    .episode-air-date {
      margin: 0;
      font-size: 0.875rem;
      color: #666;
    }
    .episode-characters-count {
      display: inline-block;
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #888;
      background: #f5f5f5;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
  `]
})
export class EpisodeCardComponent {
  readonly episode = input.required<Episode>();
  readonly selectEpisode = output<Episode>();
}
