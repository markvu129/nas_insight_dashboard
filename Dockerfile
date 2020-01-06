FROM node:carbon
WORKDIR /tmp
COPY package.json /tmp/
RUN npm install
RUN npm install webpack@3.3.0 -g --save -dev
RUN npm install webpack-cli -g --save -dev


WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN cp -a /tmp/node_modules /usr/src/app/
CMD webpack --watch --watch-polling
ENV NODE_ENV=production
ENV PORT=3000
CMD [ "npm", "start"]
EXPOSE 3000