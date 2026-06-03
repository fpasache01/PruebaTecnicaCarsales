using System.Net;
using System.Text.Json;
using Bff.Api.Models;
using Bff.Api.Services;
using Moq;
using Moq.Protected;

namespace Bff.Tests.Services;

public class RickAndMortyServiceTests
{
    private readonly JsonSerializerOptions _jsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private RickAndMortyService CreateService(HttpResponseMessage response)
    {
        var handlerMock = new Mock<HttpMessageHandler>();
        handlerMock
            .Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>())
            .ReturnsAsync(response);

        var httpClient = new HttpClient(handlerMock.Object)
        {
            BaseAddress = new Uri("https://rickandmortyapi.com")
        };

        return new RickAndMortyService(httpClient);
    }

    [Fact]
    public async Task GetEpisodesAsync_ReturnsPaginatedResult()
    {
        var apiResponse = new RickAndMortyResponse<Episode>
        {
            Info = new Info { Count = 2, Pages = 1, Next = null, Prev = null },
            Results =
            [
                new Episode { Id = 1, Name = "Pilot", EpisodeCode = "S01E01" },
                new Episode { Id = 2, Name = "Lawnmower Dog", EpisodeCode = "S01E02" }
            ]
        };

        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(apiResponse, _jsonOptions))
        };

        var service = CreateService(response);
        var result = await service.GetEpisodesAsync(page: 1);

        Assert.NotNull(result);
        Assert.Equal(2, result.TotalCount);
        Assert.Equal(1, result.TotalPages);
        Assert.Equal(2, result.Data.Count);
        Assert.Equal("Pilot", result.Data[0].Name);
    }

    [Fact]
    public async Task GetEpisodesAsync_WhenApiFails_ThrowsHttpRequestException()
    {
        var response = new HttpResponseMessage(HttpStatusCode.InternalServerError);
        var service = CreateService(response);

        await Assert.ThrowsAsync<HttpRequestException>(() => service.GetEpisodesAsync(page: 1));
    }

    [Fact]
    public async Task GetEpisodeByIdAsync_ReturnsEpisode()
    {
        var episode = new Episode
        {
            Id = 1,
            Name = "Pilot",
            EpisodeCode = "S01E01",
            AirDate = "December 2, 2013"
        };

        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(episode, _jsonOptions))
        };

        var service = CreateService(response);
        var result = await service.GetEpisodeByIdAsync(1);

        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Pilot", result.Name);
        Assert.Equal("S01E01", result.EpisodeCode);
    }

    [Fact]
    public async Task GetEpisodeByIdAsync_WhenNotFound_ThrowsHttpRequestException()
    {
        var response = new HttpResponseMessage(HttpStatusCode.NotFound);
        var service = CreateService(response);

        await Assert.ThrowsAsync<HttpRequestException>(() => service.GetEpisodeByIdAsync(9999));
    }

    [Fact]
    public async Task GetEpisodesAsync_HandlesPaginationCorrectly()
    {
        var apiResponse = new RickAndMortyResponse<Episode>
        {
            Info = new Info
            {
                Count = 20,
                Pages = 2,
                Next = "https://rickandmortyapi.com/api/episode?page=2",
                Prev = null
            },
            Results =
            [
                new Episode { Id = 1, Name = "Pilot", EpisodeCode = "S01E01" }
            ]
        };

        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
            Content = new StringContent(JsonSerializer.Serialize(apiResponse, _jsonOptions))
        };

        var service = CreateService(response);
        var result = await service.GetEpisodesAsync(page: 1);

        Assert.True(result.HasNext);
        Assert.False(result.HasPrev);
        Assert.Equal(2, result.TotalPages);
        Assert.Equal(20, result.TotalCount);
    }
}
