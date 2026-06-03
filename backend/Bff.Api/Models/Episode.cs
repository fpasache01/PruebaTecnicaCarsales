namespace Bff.Api.Models;

public class Episode
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string AirDate { get; set; } = string.Empty;
    public string EpisodeCode { get; set; } = string.Empty;
    public List<string> Characters { get; set; } = [];
    public string Url { get; set; } = string.Empty;
    public DateTime Created { get; set; }
}

public class RickAndMortyResponse<T>
{
    public Info Info { get; set; } = new();
    public List<T> Results { get; set; } = [];
}

public class Info
{
    public int Count { get; set; }
    public int Pages { get; set; }
    public string? Next { get; set; }
    public string? Prev { get; set; }
}

public class PaginatedResult<T>
{
    public List<T> Data { get; set; } = [];
    public int TotalCount { get; set; }
    public int TotalPages { get; set; }
    public int CurrentPage { get; set; }
    public bool HasNext { get; set; }
    public bool HasPrev { get; set; }
}

public class ApiResponse<T>
{
    public bool Success { get; set; }
    public T? Data { get; set; }
    public string? Error { get; set; }
    public int StatusCode { get; set; }
}
