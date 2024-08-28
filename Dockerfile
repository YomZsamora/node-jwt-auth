# Use an official Node.js runtime as a parent image
FROM node:18
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .