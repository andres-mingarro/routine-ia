@AGENTS.md

# Routine IA

## REGLA ABSOLUTA — Todo debe ser gratuito

**Nunca usar nada que genere costos de dinero. Siempre priorizar el tier gratuito.**

| Servicio | Tier gratuito usado |
|----------|-------------------|
| **Neon** | Free tier: 0.5 GB storage, 1 branch, auto-suspend compute |
| **Vercel** | Hobby plan: deploys ilimitados, 100 GB bandwidth/mes |
| **Groq** | `llama-3.3-70b-versatile`: 30 RPM, 14.400 req/día, gratis sin tarjeta |

- No activar features de pago en Neon (read replicas, escalar compute, etc.)
- No pasar del Hobby plan en Vercel
- No usar modelos de Groq que no sean gratuitos
- Ante la duda, verificar que sea gratuito antes de implementar

App de rutinas de gimnasio con IA. Genera rutinas semanales personalizadas basadas en el perfil del usuario y el historial de las últimas 2 semanas.

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind CSS + SCSS Modules (cada componente tiene su propio `.module.scss`)
- Drizzle ORM + Neon PostgreSQL (serverless)
- Groq API (`llama-3.3-70b-versatile`) — modelo gratuito, fetch directo sin SDK
- Deploy en Vercel

## Estructura

```
src/
  app/                        # Rutas Next.js App Router
    page.tsx                  # Redirect a /setup o /routine
    layout.tsx
    setup/page.tsx            # Formulario de perfil
    routine/page.tsx          # Rutina semanal actual
    history/page.tsx          # Historial de rutinas
    api/
      user/route.ts           # GET/POST perfil de usuario
      generate-routine/route.ts  # GET rutina actual / POST generar nueva
      history/route.ts        # GET historial
  components/                 # Cada componente en su propia carpeta
    Header/
    Navigation/
    SetupForm/
    WeeklyRoutine/
    DayCard/
    ExerciseItem/
    ExerciseIcon/
    RoutineHistory/
    LoadingSpinner/
  lib/
    db.ts                     # Conexión Neon + initDB() auto-crea tablas
    schema.ts                 # Drizzle schema
    ai.ts                     # Llamada a Gemini API
    exercises.ts              # Mapeo ejercicio → emoji + colores
  types/index.ts
```

## Convenciones

- **Código siempre en inglés** (variables, funciones, tipos, comentarios)
- **Texto visible en el frontend siempre en español**
- Cada componente tiene: `ComponentName.tsx` + `ComponentName.module.scss` + `index.ts`
- Tema claro: fondo `#f0f4f8`, cards `#ffffff`, acento verde `#10b981`
- No usar `@anthropic-ai/sdk` — usar `@google/generative-ai`

## Base de datos

Las tablas se crean automáticamente en el primer request via `initDB()`.

Schema: `users` → `routines` → `routine_days` → `exercises`

Usuario único: `DEFAULT_USER_ID = 1`

## Variables de entorno

```
DATABASE_URL=...neon.tech...
GEMINI_API_KEY=...
```

## Comandos

```bash
npm run dev        # Desarrollo
npm run build      # Build producción
npm run db:studio  # Drizzle Studio (explorar DB)
```
