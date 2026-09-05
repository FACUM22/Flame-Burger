# Publicar Flame Burger en Netlify

Este proyecto se divide en dos partes:

- `frontend/` y `admin/`: sitio que se publica en Netlify.
- `server/`: API de Node.js, PostgreSQL, imágenes y Mercado Pago. Debe estar
  alojada en un servicio que ejecute Node.js de forma continua.

## Configuración de Netlify

1. Creá un repositorio vacío en GitHub.
2. Abrí la carpeta `FlameBurger` extraída del ZIP y subí **su contenido**
   al repositorio: `admin/`, `frontend/`, `server/`, `scripts/`,
   `netlify.toml`, `.gitignore` y este archivo. `netlify.toml` debe quedar en
   la raíz del repositorio.
3. Conectá el repositorio en Netlify.
4. Creá la variable de entorno `FLAME_API_URL` con la URL pública del backend,
   sin `/` al final. Ejemplo:

   `https://flame-burger-api.example.com`

5. Ejecutá el deploy. El build genera `public/` con el frontend y el panel
   administrativo, y no publica `server/`, `.env` ni `node_modules/`.

La configuración incluida usa `.` como directorio base. Si en vez de subir el
contenido subís la carpeta `FlameBurger` completa dentro del repositorio,
configurá `FlameBurger` como Base directory en Netlify.

## Backend

El backend debe tener configuradas estas variables:

- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `MP_ACCESS_TOKEN` si se usa Mercado Pago
- `MP_PUBLIC_URL` con la URL pública de Netlify si se usan retornos de pago
- `MP_WEBHOOK_URL` con la URL pública del endpoint de webhook

La API actual habilita CORS para recibir solicitudes desde Netlify. Antes de
pasar a producción conviene restringirlo al dominio real de la web.