FROM node:carbon

RUN mkdir /code
WORKDIR /code
RUN pwd

ADD config.js ./
ADD server.js ./
ADD package.json ./
RUN npm install

RUN ls

CMD ["npm", "start"]
EXPOSE 1337