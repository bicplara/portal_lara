# Portal Lara

Portal corporativo estático em React + Vite: mural de publicações, avisos, campanhas, busca, calendário navegável, exportação de eventos (.ics), links úteis e leituras salvas no navegador. Sem backend, banco de dados ou autenticação.

## Rodar no computador

Requer Node.js 22.12+ (ou 24 LTS) e npm.

```sh
npm install
npm run dev
```

Abra o endereço informado pelo Vite. Para gerar a versão final:

```sh
npm run build
npm run preview
```

O comando de build valida o conteúdo antes de gerar a pasta `dist`. Use `npm run check` para validar somente os conteúdos.

## Onde atualizar

**Todas as publicações, eventos e atalhos ficam em `src/content/portal.json`.** Não é preciso alterar os componentes React. O JSON não aceita comentários nem vírgulas depois do último item. Use um editor como VS Code ou o editor do GitHub.

### Nova publicação

Adicione um objeto à lista `posts`. A ordenação por data é automática. Exemplo:

```json
{
  "id": "campanha-novembro-2026",
  "category": "Campanhas",
  "title": "Título da sua campanha",
  "excerpt": "Resumo que aparece no mural.",
  "body": [
    "Primeiro parágrafo da publicação completa.",
    "Segundo parágrafo, com todos os detalhes."
  ],
  "date": "2026-11-01",
  "author": "Comunicação",
  "initials": "CO",
  "readTime": "2 min",
  "image": "/images/sua-campanha.jpg",
  "imageAlt": "Descrição da imagem para leitores de tela",
  "pinned": false
}
```

- Cada `id` deve ser único e permanente. Use letras minúsculas, números e hífens.
- Categorias disponíveis: `Avisos`, `Campanhas`, `Novidades` e `Nossa cultura`.
- Datas usam `AAAA-MM-DD`. A data é informativa: não agenda ou oculta automaticamente publicações futuras.
- `body` é uma lista de parágrafos de texto simples; não requer HTML.
- Para uma publicação sem imagem, remova `image` e `imageAlt`.
- `pinned: true` exibe o selo de destaque. A ordenação continua sendo por data.
- Para remover uma publicação, remova seu objeto e ajuste `hero.postId` caso ele aponte para ela.

### Imagens

Coloque seus JPG, PNG, WebP ou SVG em **`public/images/`**. No JSON, use **`/images/nome-do-arquivo.jpg`** (sem `public`). Prefira imagens horizontais de aproximadamente 1200 × 650 pixels e arquivos comprimidos. As ilustrações iniciais estão no projeto e podem ser substituídas. As imagens são locais; apenas as fontes usam Google Fonts, com fontes de sistema como alternativa.

### Novo evento

Adicione à lista `events`:

```json
{
  "id": "reuniao-novembro",
  "title": "Encontro da equipe",
  "date": "2026-11-05",
  "time": "14:00",
  "endTime": "15:00",
  "location": "Sala de encontros",
  "category": "Encontro",
  "description": "Detalhes do evento para toda a equipe."
}
```

Os horários usam o fuso de Brasília (`America/Sao_Paulo`). Para um evento de dia inteiro, use `"time": ""` e remova `endTime`. Eventos com horário devem começar e terminar no mesmo dia. O usuário pode abrir o evento e baixar um arquivo `.ics` para importar no Google Calendar, Outlook ou outro aplicativo de agenda. O portal não envia convites nem lembretes. Eventos passados continuam acessíveis no calendário; os próximos encontros consideram a data local do visitante.

### Atalhos e documentos

Na lista `resources`, use `body` para abrir um texto no portal ou `url` para abrir um documento/link. Exemplo de recurso com PDF:

```json
{
  "id": "manual",
  "title": "Manual da equipe",
  "description": "Informações para o dia a dia",
  "icon": "book",
  "url": "/documentos/manual.pdf"
}
```

Nesse caso, coloque o PDF em `public/documentos/manual.pdf`. Links externos devem começar com `https://`. Ícones disponíveis: `book`, `folder`, `heart`.

### Identidade e destaque principal

- `company.name` e `company.footer`: nome e assinatura do portal.
- `company.demo`: mantenha `true` enquanto houver conteúdo de exemplo; mude para `false` após substituí-lo.
- `hero`: chamada principal. `postId` deve corresponder ao `id` da publicação aberta pelo botão.
- `src/styles.css`: cores, fontes e estilos responsivos.
- `src/App.jsx`: componentes, marca visual e interações. O logotipo inicial usa o nome Lara; ajuste também o título em `index.html` e o favicon ao mudar a marca.

## Publicar na Vercel

1. Envie o projeto para um repositório no GitHub, GitLab ou Bitbucket.
2. Na Vercel, importe o repositório como um novo projeto.
3. Use o preset **Vite**, build **`npm run build`** e saída **`dist`** (também definidos em `vercel.json`).
4. Publique. Não são necessárias variáveis de ambiente.

Depois, basta editar `src/content/portal.json`, adicionar as imagens e fazer commit/push na branch de produção. A integração Git da Vercel gera uma nova publicação automaticamente. É possível editar o JSON e enviar imagens diretamente pela interface do GitHub.

Referência: https://vite.dev/guide/static-deploy.html#vercel

## Como funciona a edição sem backend

O conteúdo é parte dos arquivos do site. Uma alteração no repositório precisa de um novo build/deploy para aparecer aos visitantes. Não existe painel de edição no site. Os salvos usam `localStorage`: são pessoais a este navegador/dispositivo, não sincronizam e não representam interações de outros usuários. Se o armazenamento estiver bloqueado, os salvos duram apenas a sessão.

Como solicitado, não há autenticação: o conteúdo publicado é acessível a qualquer pessoa com acesso à URL. As publicações iniciais são exemplos e devem ser substituídas antes do uso na empresa.
