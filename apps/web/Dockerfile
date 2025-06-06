FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages/types/package.json ./packages/types/package.json
RUN npm install
COPY  .
RUN npm run build --workspace=@fircle/web
EXPOSE 3000
CMD ["npm", "start", "--workspace=@fircle/web"]
