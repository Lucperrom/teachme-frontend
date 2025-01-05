FROM node:23-alpine as builder

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV VITE_OPENAI_API_KEY=$VITE_OPENAI_API_KEY

RUN npm run build

FROM node:23-alpine

RUN npm i -g serve

WORKDIR /app

COPY --from=builder /app/dist /app/dist

EXPOSE 3000

CMD ["serve", "-s", "/app/dist"]
