# Célere IA — site institucional

Site estático de https://soucelere.app (hospedagem Hostinger, implantação via Git a partir do branch `soucelere-app`).

## Estrutura
- `index.html` — página principal (conteúdo, SEO e dados estruturados JSON-LD)
- `assets/css/site.css` — estilos (tokens de cor e movimento no topo)
- `assets/js/site.js` — interações (demos, calculadora, abas, menu)
- `assets/img/` — ícones e imagem de compartilhamento (Open Graph)
- `politica-de-privacidade.html`, `404.html`
- `.htaccess` — HTTPS, cabeçalhos de segurança (CSP, HSTS...), bloqueio de arquivos sensíveis, cache
- `robots.txt`, `sitemap.xml`, `llms.txt` — buscadores e assistentes de IA
- `.well-known/security.txt`

## Contatos
WhatsApp/telefone `+55 61 9944-9988` (`556199449988` nos links `wa.me`) e `contato@soucelere.com.br`.
Para trocar, procure por `556199449988` e `contato@soucelere.com.br` em todos os arquivos.

## Regras de segurança ao editar
- Não use `<script>` inline nem `onclick=`: a CSP bloqueia. Coloque JS em `assets/js/site.js`.
- Para adicionar Meta Pixel, Google Analytics ou outra ferramenta, inclua os domínios no `Content-Security-Policy` do `.htaccess`.
- Ao alterar CSS/JS, aumente o `?v=` nos links do `index.html` (o cache é de 1 ano).
- Ao mudar preços ou FAQ, atualize também o JSON-LD do `index.html` e o `llms.txt`.

## Publicação (soucelere.app)
- Servidor: VPS srv2001048 (Easypanel), projeto `celere`, serviço `site` (Dockerfile com Apache).
- Deploy automático: webhook do GitHub (push) aciona a implantação no Easypanel; o serviço sempre puxa o branch `soucelere-app`.
- Para publicar: faça commit/push no branch `soucelere-app`. Em ~1 minuto o site atualiza.
