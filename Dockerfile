FROM node:lts

RUN npm i -g @nestjs/cli

WORKDIR /opt/app
COPY . .

RUN npm install

CMD [ "npm", "run", "start:dev" ]