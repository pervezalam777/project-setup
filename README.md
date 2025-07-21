
# Check Docker Container Logs

After running `docker compose -f docker-compose.dev.yml up` or `docker run -p 3000:3000 my-fullstack-app:latest`, inspect the logs of your container for any errors during the build or startup process.

For docker-compose: `docker compose -f docker-compose.dev.yml logs app`

For a standalone container: `docker logs <container_id_or_name>`

Look specifically for messages related to the frontend build (npm run build in client/) or the Express server starting up.