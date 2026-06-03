using System.Text.Json;
using Bff.Api.Models;

namespace Bff.Api.Services;

public class RickAndMortyService : IRickAndMortyService
{
    private readonly HttpClient _httpClient;
    private readonly JsonSerializerOptions _jsonOptions;

    public RickAndMortyService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };
    }

    public async Task<PaginatedResult<Episode>> GetEpisodesAsync(int page = 1, string? name = null)
    {
        var url = $"/api/episode?page={page}";
        if (!string.IsNullOrWhiteSpace(name))
            url += $"&name={Uri.EscapeDataString(name)}";

        var response = await _httpClient.GetAsync(url);
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var apiResponse = JsonSerializer.Deserialize<RickAndMortyResponse<Episode>>(content, _jsonOptions);

        if (apiResponse == null)
            throw new InvalidOperationException("Failed to deserialize API response");

        return new PaginatedResult<Episode>
        {
            Data = apiResponse.Results,
            TotalCount = apiResponse.Info.Count,
            TotalPages = apiResponse.Info.Pages,
            CurrentPage = page,
            HasNext = apiResponse.Info.Next != null,
            HasPrev = apiResponse.Info.Prev != null
        };
    }

    public async Task<Episode?> GetEpisodeByIdAsync(int id)
    {
        var response = await _httpClient.GetAsync($"/api/episode/{id}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        return JsonSerializer.Deserialize<Episode>(content, _jsonOptions);
    }
}
