# 1. Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /app

# copy csproj and restore
COPY *.sln .
COPY TodoApi/*.csproj ./TodoApi/
RUN dotnet restore

# copy everything else & publish
COPY TodoApi/. ./TodoApi/
WORKDIR /app/TodoApi
RUN dotnet publish -c Release -o out

# 2. Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /app/TodoApi/out ./

# expose the port your app listens on
ENV ASPNETCORE_URLS=http://+:5140
EXPOSE 5140

# entrypoint
ENTRYPOINT ["dotnet", "TodoApi.dll"]
