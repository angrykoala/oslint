FROM node:12-slim

WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

# TODO: use proper compilation and set this variable before install
ENV NODE_ENV=production

COPY . /app

CMD ["npm", "start"]
