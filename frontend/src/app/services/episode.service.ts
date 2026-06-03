import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Episode } from '../models/episode.model';
import { ApiResponse, PaginatedResult } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class EpisodeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/api/episodes`;

  getEpisodes(page: number = 1, name?: string): Observable<ApiResponse<PaginatedResult<Episode>>> {
    let params = new HttpParams().set('page', page.toString());
    if (name && name.trim()) {
      params = params.set('name', name.trim());
    }
    return this.http.get<ApiResponse<PaginatedResult<Episode>>>(this.baseUrl, { params });
  }

  getEpisode(id: number): Observable<ApiResponse<Episode>> {
    return this.http.get<ApiResponse<Episode>>(`${this.baseUrl}/${id}`);
  }
}
