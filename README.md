# DTalles Jewelry - E-commerce

## 🚀 Cómo Publicar tu Web (Deploy)

Para subir los cambios a GitHub y que tu página funcione online, sigue estos pasos en tu terminal (Terminal de VS Code):

### 1. Instalar la herramienta de GitHub (Solo una vez)
Copia y pega este comando:
```bash
brew install gh
```

### 2. Iniciar Sesión (Solo una vez)
Copia y pega este comando y sigue las instrucciones en pantalla (elige GitHub.com -> HTTPS -> Y -> Browser):
```bash
gh auth login
```

### 3. Subir los cambios
Una vez conectado, ejecuta estos tres comandos uno por uno:
```bash
git add .
git commit -m "Actualización completa Home Page"
git push
```

---

# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
