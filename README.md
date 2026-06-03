## Arquitectura

```
Rick & Morty API  ←→  .NET BFF (localhost:5000)  ←→  Angular (localhost:4200)
```

## Requisitos

- Docker (para devcontainer)
- Visual Studio Code con extensión "Dev Containers"


```bash
# Backend
cd backend
dotnet restore
dotnet run --project Bff.Api/Bff.Api.csproj

# Frontend
cd frontend
npm install
ng serve
```

4. Abrir http://localhost:4200

## Backend - Endpoints

GET | `/api/episodes?page=1&name=rick` | Lista episodios paginados |
GET | `/api/episodes/{id}` | Detalle de un episodio |

## Backend - Tests

```bash
cd backend
dotnet test
```


