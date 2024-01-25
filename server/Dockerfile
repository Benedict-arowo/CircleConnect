FROM node:20-alpine

WORKDIR /home/server

COPY package*.json ./
RUN npm install

# Change ownership of the entire directory before copying the application code
RUN chown -R node:node /home/server

COPY . .

USER node

EXPOSE 8000

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "dev"]