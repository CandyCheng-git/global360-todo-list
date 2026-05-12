FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY Todo.Api/Todo.Api.csproj Todo.Api/
RUN dotnet restore Todo.Api/Todo.Api.csproj

COPY . .
RUN dotnet publish Todo.Api/Todo.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 5000
ENTRYPOINT ["dotnet", "Todo.Api.dll"]
