FROM node:24-alpine AS ui-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY components.json tsconfig.json vite.config.ts ./
COPY frontend ./frontend
COPY pages ./pages
COPY includes ./includes
RUN npm run build

FROM php:8.2-apache

# Copy all files
COPY . /var/www/html/
COPY --from=ui-build /app/assets/build/ /var/www/html/assets/build/

# Set the frontend/pages as accessible
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

RUN docker-php-ext-install pdo pdo_mysql
RUN a2enmod rewrite

EXPOSE 80
