FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY packages/types/package.json ./packages/types/package.json
RUN npm install
COPY  .
EXPOSE 3001
CMD ["npm", "start", "--workspace=@fircle/api"]
