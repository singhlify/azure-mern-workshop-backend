# ============================================================
# Dockerfile — Backend (Express / Node.js API)
# ============================================================
# A Dockerfile is a step-by-step recipe Docker follows to build
# a container image for your app. Each instruction creates a
# "layer" in the image. The final image is deployed to Azure
# App Service and runs as a container.
# ============================================================


# STEP 1 — Pick a base image
# Every container starts FROM an existing image. We use the
# official Node.js 22 image built on Alpine Linux. Alpine is a
# minimal Linux distro (~5 MB), keeping the image small and
# fast to download during deployment.
FROM node:22-alpine


# STEP 2 — Set the working directory
# WORKDIR creates the /app folder inside the container and
# makes it the default directory for every command that follows.
# Think of it like running "cd /app" before anything else.
WORKDIR /app


# STEP 3 — Install the pnpm package manager
# Node.js ships with npm by default, but this project uses pnpm
# (faster installs, saves disk space). "corepack" is a built-in
# Node.js utility that manages alternative package managers.
# This line enables corepack and pins pnpm to the exact version
# that matches our lockfile, ensuring consistent installs.
#
# NOTE: You might see "npm install -g pnpm" in other tutorials,
# but corepack is the recommended approach for Node.js 16.9+.
RUN corepack enable && corepack prepare pnpm@10.26.2 --activate


# STEP 4 — Copy dependency manifests first (for caching)
# We copy ONLY package.json and the lockfile before the rest of
# the code. Why? Docker caches each layer. If these two files
# haven't changed, Docker skips the "pnpm install" step on the
# next build — saving minutes of download time. This trick is
# called "layer caching" and is a key Docker optimization.
COPY package.json pnpm-lock.yaml ./


# STEP 5 — Install production dependencies only
# The --prod flag tells pnpm to skip devDependencies (testing
# tools, linters, etc.). The backend doesn't need a build step
# like the frontend — Express runs the source files directly —
# so we only ship what's needed at runtime. This keeps the
# final image smaller and more secure.
RUN pnpm install --prod


# STEP 6 — Copy the rest of the application code
# Now we copy everything else (routes, models, controllers,
# etc.). Because this layer comes AFTER the install step,
# changing your source code won't invalidate the cached
# dependency layer — keeping rebuilds fast.
COPY . .


# STEP 7 — Expose the port
# EXPOSE documents which port the container listens on. Azure
# App Service routes incoming HTTP traffic to port 80 by
# default. Note: EXPOSE alone doesn't publish the port — it's
# metadata that Azure and Docker use to route traffic correctly.
EXPOSE 80


# STEP 8 — Set environment variables
# PORT  — tells the Express server which port to listen on.
# HOST  — 0.0.0.0 means "accept connections from any network
#         interface", which is required inside a container so
#         Azure's networking layer can reach your app.
# Azure App Service can override these per deployment slot
# through its Configuration > Application Settings panel.
ENV PORT=80
ENV HOST=0.0.0.0


# STEP 9 — Start the application
# CMD is the command that runs when the container starts. We
# use "sh -c" so the shell expands $PORT and $HOST at runtime,
# ensuring the Express server picks up whatever values Azure
# (or your local Docker run) has set for those variables.
# "pnpm start" maps to the "start" script in package.json
# (e.g., "node server.js" or "node index.js").
CMD ["sh", "-c", "PORT=${PORT} HOST=${HOST} pnpm start"]
