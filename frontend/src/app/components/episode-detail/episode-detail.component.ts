import { Component, inject, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EpisodeService } from '../../services/episode.service';
import { Episode } from '../../models/episode.model';
import { ErrorDisplayComponent } from '../error-display/error-display.component';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [ErrorDisplayComponent, DatePipe],
  template: `
    <div class="detail-container">
      <button class="back-btn" (click)="goBack()">&larr; Back to episodes</button>

      @defer (on immediate) {
        @if (loading()) {
          <div class="loading">Loading episode...</div>
        } @else if (error()) {
          <app-error-display [message]="error()!" (retry)="loadEpisode()" />
        } @else {
          @let ep = episode();
          @if (ep) {
            <article class="episode-detail">
              <h2 class="detail-title">{{ ep.episodeCode }}: {{ ep.name }}</h2>
              <dl class="detail-info">
                <div class="info-row">
                  <dt>Air Date</dt>
                  <dd>{{ ep.airDate }}</dd>
                </div>
                <div class="info-row">
                  <dt>Episode Code</dt>
                  <dd>{{ ep.episodeCode }}</dd>
                </div>
                <div class="info-row">
                  <dt>Created</dt>
                  <dd>{{ ep.created | date:'medium' }}</dd>
                </div>
                <div class="info-row">
                  <dt>Characters</dt>
                  <dd>{{ ep.characters.length }}</dd>
                </div>
              </dl>
              <div class="characters-section">
                <h3>Character URLs ({{ ep.characters.length }})</h3>
                <ul class="characters-list">
                  @for (url of ep.characters; track url) {
                    <li class="character-item">
                      <a [href]="url" target="_blank" rel="noopener">{{ url }}</a>
                    </li>
                  }
                </ul>
              </div>
            </article>
          }
        }
      } @placeholder {
        <div class="loading">Loading...</div>
      }
    </div>
  `,
  styles: [`
    .detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    .back-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #4a90d9;
      border-radius: 4px;
      background: #fff;
      color: #4a90d9;
      cursor: pointer;
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .back-btn:hover {
      background: #4a90d9;
      color: #fff;
    }
    .episode-detail {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 2rem;
    }
    .detail-title {
      margin: 0 0 1.5rem;
      color: #222;
      font-size: 1.5rem;
    }
    .detail-info {
      margin: 0 0 2rem;
    }
    .info-row {
      display: flex;
      padding: 0.5rem 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .info-row dt {
      width: 150px;
      font-weight: 600;
      color: #555;
    }
    .info-row dd {
      margin: 0;
      color: #333;
    }
    .characters-section h3 {
      margin: 0 0 0.75rem;
      color: #333;
    }
    .characters-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .character-item {
      padding: 0.3rem 0.6rem;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 0.8rem;
      word-break: break-all;
    }
    .character-item a {
      color: #4a90d9;
      text-decoration: none;
    }
    .character-item a:hover {
      text-decoration: underline;
    }
    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-size: 1.1rem;
    }
  `]
})
export class EpisodeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly episodeService = inject(EpisodeService);

  readonly episode = signal<Episode | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadEpisode();
  }

  loadEpisode(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('Invalid episode ID');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.episodeService.getEpisode(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.episode.set(response.data);
        } else {
          this.error.set(response.error ?? 'Episode not found');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
