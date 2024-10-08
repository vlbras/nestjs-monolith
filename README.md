# Commands to run on the server

- `ssh 34.132.137.18`
- `cd lava-api`
- `git pull`
- *optional* `npm run build`
- `docker stop lava-api`
- `docker build -t lava-api . --no-cache`
- `docker run --name lava-api -p 3000:3000 --rm=true -d lava-api:latest`
- *to verify* `docker ps`