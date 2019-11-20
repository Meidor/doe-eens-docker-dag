# Docker Files

```
# Dockerfile
FROM node:10-alpine
RUN apk --update add git openssh
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
```
