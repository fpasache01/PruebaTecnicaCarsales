import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EpisodeService } from '../../services/episode.service';
import { Episode } from '../../models/episode.model';
import { PaginatedResult } from '../../models/api-response.model';
import { EpisodeCardComponent } from '../../components/episode-card/episode-card.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ErrorDisplayComponent } from '../../components/error-display/error-display.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    EpisodeCardComponent,
    PaginationComponent,
    SearchBarComponent,
    ErrorDisplayComponent,
  ],
  template: `
    <section class="home">
      <header class="home-header">
        <h1 class="home-title">Rick & Morty Episodes</h1>
        <app-search-bar (search)="onSearch($event)" />
      </header>

      @if (loading()) {
        <div class="loading">Loading episodes...</div>
      }

      @if (error(); as errMsg) {
        <app-error-display [message]="errMsg" (retry)="loadEpisodes()" />
      }

      @if (paginatedResult(); as result) {
        <div class="episodes-grid">
          @for (episode of result.data; track episode.id) {
            <app-episode-card
              [episode]="episode"
              (selectEpisode)="onSelectEpisode($event)" />
          } @empty {
            <p class="no-results">No episodes found matching your search.</p>
          }
        </div>

        @if (result.totalPages > 1) {
          <app-pagination
            [currentPage]="result.currentPage"
            [totalPages]="result.totalPages"
            (pageChange)="onPageChange($event)" />
        }
      }
    </section>
  `,
  styles: [`
    .home {
      max-width: 1200px;
      margin: 0 auto;
      padding: 1rem;
    }
    .home-header {
      margin-bottom: 1rem;
    }
    .home-title {
      margin: 0 0 1rem;
      font-size: 1.8rem;
      color: #222;
    }
    .episodes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .no-results {
      grid-column: 1 / -1;
      text-align: center;
      padding: 2rem;
      color: #888;
      font-size: 1.1rem;
    }
    .loading {
      text-align: center;
      padding: 3rem;
      color: #666;
      font-size: 1.2rem;
    }
  `]
})
export class HomeComponent {
  private readonly episodeService = inject(EpisodeService);
  private readonly router = inject(Router);

  readonly paginatedResult = signal<PaginatedResult<Episode> | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly currentPage = signal(1);
  readonly searchTerm = signal('');

  constructor() {
    this.loadEpisodes();
  }

  loadEpisodes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.episodeService.getEpisodes(this.currentPage(), this.searchTerm()).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.paginatedResult.set(response.data);
        } else {
          this.error.set(response.error ?? 'Failed to load episodes');
        }
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadEpisodes();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadEpisodes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSelectEpisode(episode: Episode): void {
    this.router.navigate(['/episode', episode.id]);
  }
}
