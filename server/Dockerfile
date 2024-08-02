# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /source

# copy csproj and restore as distinct layers
COPY *.sln .
COPY *.csproj .
RUN dotnet restore

# copy everything else and build app
COPY . ./aspnetapp/
WORKDIR /source/aspnetapp
RUN dotnet add package Microsoft.AspNetCore.SignalR.Client
ARG CLIENT_DOMAIN
ARG CLIENT_PORT
ARG IS_HTTPS
ARG ROOM_PER_SESSION
ARG USER_PER_ROOM

RUN export CLIENT_DOMAIN=${CLIENT_DOMAIN}
RUN export CLIENT_PORT=${CLIENT_PORT}
RUN export IS_HTTPS=${IS_HTTPS}
RUN export ROOM_PER_SESSION=${ROOM_PER_SESSION}
RUN export USER_PER_ROOM=${USER_PER_ROOM}

RUN dotnet publish -c release --property:PublishDir=/server --no-restore

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /server
COPY --from=build /server ./
ENTRYPOINT ["dotnet", "server.dll"]