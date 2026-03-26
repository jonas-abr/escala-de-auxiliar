# Lista de Auxiliares - PWA

## 🚀 Como Usar a PWA

Sua aplicação é agora uma PWA (Progressive Web App)! Isso significa que pode ser:
- **Instalada** como um aplicativo no celular
- **Usada offline** (com dados em cache)
- **Acessada** rapidamente com ícone na tela inicial

## 📱 Instalação no Celular

### iPhone (iOS)
1. Abra o site no Safari
2. Toque no ícone de compartilhamento (↑)
3. Selecione "Adicionar à Tela de Início"
4. Escolha um nome e toque "Adicionar"

### Android (Chrome/Firefox)
1. Abra o site no navegador
2. Toque no menu (⋮) 
3. Selecione "Instalar aplicativo" ou "Adicionar à tela inicial"
4. O aplicativo aparecerá na tela inicial

## 🌐 Deploy (Publicar Online)

Para que a PWA funcione corretamente, você precisa publicá-la em um servidor HTTPS. Você pode usar:

### Opção 1: GitHub Pages (Grátis)
1. Crie um repositório no GitHub
2. Faça upload dos arquivos
3. Ative GitHub Pages na configuração
4. O site funcionará em `https://seu-usuario.github.io/seu-repo`

### Opção 2: Netlify (Grátis)
1. Acesse [netlify.com](https://www.netlify.com)
2. Clique "Deploy manually"
3. Arraste a pasta do projeto
4. Seu site estará online automaticamente (HTTPS incluído)

### Opção 3: Vercel (Grátis)
1. Acesse [vercel.com](https://vercel.com)
2. Clique "New Project"
3. Faça upload dos arquivos
4. Deploy automático com HTTPS

### Opção 4: Seu próprio servidor (com custo)
1. Contrate um servidor com suporte a HTTPS
2. Faça upload dos arquivos via FTP
3. Garanta que o arquivo `.htaccess` esteja no servidor

## 📂 Arquivos da PWA

```
escala-de-auxiliar/
├── index.html           # HTML principal (com tags PWA)
├── style.css           # Estilos
├── script.js           # Lógica
├── manifest.json       # Configurações da PWA
├── service-worker.js   # Para funcionamento offline
└── .htaccess          # Configurações do servidor (opcional)
```

## ✨ Recursos da PWA

✅ **Ícone na tela inicial** - Acesso rápido como um app nativo
✅ **Funciona offline** - Cache automático de páginas
✅ **Modo fullscreen** - Parece um app nativo
✅ **Tema customizado** - Cor azul (#007bff)
✅ **Rápido** - Carregamento otimizado

## 🔄 Atualizar a PWA

Quando você fazer alterações no código:
1. O service worker detecta automaticamente
2. A versão antiga é armazenada em cache
3. A próxima vez que abrir, terá a versão nova

## 📋 Checklist

- [ ] Publicar em servidor HTTPS
- [ ] Testar instalação no celular
- [ ] Testar funcionamento offline
- [ ] Compartilhar link com usuários

---

**Pronto para instalar!** Abra seu site no celular e procure pela opção de instalar. 🎉
