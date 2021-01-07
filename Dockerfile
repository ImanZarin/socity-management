FROM node:15-alpine
WORKDIR '/app'
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
EXPOSE 3005
CMD ["npm","run","start:prod"]