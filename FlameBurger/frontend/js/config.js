/*
 * URL del backend.
 *
 * En Netlify este archivo se reemplaza durante el build con el valor
 * definido en FLAME_API_URL. El fallback permite seguir trabajando en local.
 */
window.FLAME_API_URL =
    window.FLAME_API_URL ||
    "http://localhost:3000";