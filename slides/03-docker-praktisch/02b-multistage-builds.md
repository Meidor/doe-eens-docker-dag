# Multi-stage builds

```
# Dockerfile
FROM microsoft/dotnet:2.2-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 80

FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /src
COPY ["FinControlDashboard.sln", "./"]
COPY ["src/FinControlDashboard.Service/FinControlDashboard/FinControlDashboard.csproj", "FinControlDashboard.Service/FinControlDashboard/"]
COPY ["src/FinControlDashboard.Service/FinControlDashboard.Models/FinControlDashboard.Models.csproj", "FinControlDashboard.Service/FinControlDashboard.Models/"]
COPY ["src/FinControlDashboard.Service/FinControlDashboard.Services/FinControlDashboard.Services.csproj", "FinControlDashboard.Service/FinControlDashboard.Services/"]
RUN dotnet restore
COPY . .
WORKDIR "/src/FinControlDashboard.Service/FinControlDashboard"
RUN dotnet build "FinControlDashboard.csproj" -c Release -o /app --no-restore

FROM build AS publish
RUN dotnet publish "FinControlDashboard.csproj" -c Release -o /app --no-restore

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "FinControlDashboard.dll"]
```
