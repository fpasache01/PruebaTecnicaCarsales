using Bff.Api.Models;
using Bff.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Bff.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class EpisodesController : ControllerBase
{
    private readonly IRickAndMortyService _service;

    public EpisodesController(IRickAndMortyService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<Episode>>>> GetEpisodes(
        [FromQuery] int page = 1,
        [FromQuery] string? name = null)
    {
        try
        {
            var result = await _service.GetEpisodesAsync(page, name);
            return Ok(new ApiResponse<PaginatedResult<Episode>>
            {
                Success = true,
                Data = result,
                StatusCode = 200
            });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new ApiResponse<PaginatedResult<Episode>>
            {
                Success = false,
                Error = $"External API error: {ex.Message}",
                StatusCode = 502
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<PaginatedResult<Episode>>
            {
                Success = false,
                Error = $"Internal error: {ex.Message}",
                StatusCode = 500
            });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApiResponse<Episode>>> GetEpisode(int id)
    {
        try
        {
            var episode = await _service.GetEpisodeByIdAsync(id);
            if (episode == null)
            {
                return NotFound(new ApiResponse<Episode>
                {
                    Success = false,
                    Error = "Episode not found",
                    StatusCode = 404
                });
            }

            return Ok(new ApiResponse<Episode>
            {
                Success = true,
                Data = episode,
                StatusCode = 200
            });
        }
        catch (HttpRequestException ex)
        {
            return StatusCode(502, new ApiResponse<Episode>
            {
                Success = false,
                Error = $"External API error: {ex.Message}",
                StatusCode = 502
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<Episode>
            {
                Success = false,
                Error = $"Internal error: {ex.Message}",
                StatusCode = 500
            });
        }
    }
}
