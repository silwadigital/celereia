# Célere IA — site estático servido por Apache (respeita o .htaccess)
FROM httpd:2.4-alpine
RUN sed -i \
      -e 's/^#\(LoadModule rewrite_module\)/\1/' \
      -e 's/^#\(LoadModule headers_module\)/\1/' \
      -e 's/^#\(LoadModule expires_module\)/\1/' \
      -e 's/^#\(LoadModule deflate_module\)/\1/' \
      /usr/local/apache2/conf/httpd.conf \
 && sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf \
 && printf 'ServerName soucelere.app\nServerTokens Prod\nServerSignature Off\n' >> /usr/local/apache2/conf/httpd.conf \
 && rm -rf /usr/local/apache2/htdocs/*
COPY . /usr/local/apache2/htdocs/
EXPOSE 80
