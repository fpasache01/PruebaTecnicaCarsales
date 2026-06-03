using Bff.Api.Models;

namespace Bff.Api.Services;

public interface IRickAndMortyService
{
    Task<PaginatedResult<Episode>> GetEpisodesAsync(int page = 1, string? name = null);
    Task<Episode?> GetEpisodeByIdAsync(int id);
}
