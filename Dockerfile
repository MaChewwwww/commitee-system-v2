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

# API validation requires mbstring; Gemini requests require the PHP cURL extension.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libonig-dev libcurl4-openssl-dev ca-certificates \
    && docker-php-ext-install pdo pdo_mysql mbstring curl \
    && php -r 'foreach (["pdo_mysql", "mbstring", "curl"] as $extension) { if (!extension_loaded($extension)) { fwrite(STDERR, "Missing PHP extension: " . $extension . PHP_EOL); exit(1); } }' \
    && rm -rf /var/lib/apt/lists/*

# Copy application source
COPY . /var/www/html/
COPY --from=ui-build /app/assets/build/ /var/www/html/assets/build/

# Apache VirtualHost configuration
RUN echo '<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        AllowOverride All\n\
        Require all granted\n\
    </Directory>\n\
</VirtualHost>' > /etc/apache2/sites-available/000-default.conf

# Apache server name & rewrite module
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf \
    && a2enmod rewrite \
    && chown -R www-data:www-data /var/www/html

EXPOSE 80
