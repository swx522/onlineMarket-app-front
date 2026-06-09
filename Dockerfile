FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --registry=https://registry.npmmirror.com
COPY . .
# uni-app 3.x Vite expects sources under src/
RUN mkdir -p src && \
    mv manifest.json pages.json App.vue main.js uni.scss src/ && \
    mv pages components store api utils static js_sdk src/ 2>/dev/null || true && \
    cp -r images src/ 2>/dev/null || true
RUN npx uni build

FROM nginx:alpine
COPY --from=build /app/dist/build/h5 /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
