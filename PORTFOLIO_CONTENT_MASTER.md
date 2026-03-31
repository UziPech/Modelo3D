# PORTFOLIO CONTENT MASTER
> **Documento de contexto para el agente.** Cada sección está etiquetada con el componente destino,
> el idioma, el tono y las instrucciones exactas de inyección. No reescribas el copy — inyéctalo literal.

---

## METADATA DEL PROYECTO

```yaml
owner:        Uziel Isaac Pech Balam
alias:        UziPech
location:     Mérida, Yucatán, México
role:         Solutions Architect & Full-Stack Developer
github:       https://github.com/UziPech
tone:         Arquitecto silencioso — el trabajo habla solo
lang_primary: Bilingüe (EN headlines / ES detail)
palette:      Negro (#000) · Blanco (#fff) · Gris editorial
fonts_in_use:
  - DM Serif Display   → headlines / statements
  - Syne               → body / UI labels
  - DM Mono            → metadata / tags / monospace
```

---

## SECCIÓN 1 — HERO

> **Componente:** `ScrollContent.jsx` → `<p ref={subtitleRef}>`
> **Instrucción:** Reemplaza el texto actual del subtítulo. No toques el bloque H1 (UZIEL / ISAAC / PECH / BALAM), ese se mantiene.

### Subtítulo actual (reemplazar):
```
"Nuestras innovadoras tecnologías de restauración digital allanan el camino para preservar la historia."
```

### Subtítulo nuevo — ES:
```
Construyo sistemas reales. No demos. Cada proyecto tiene nombre, cliente y fecha de entrega.
```

### Subtítulo alternativo — EN (si el agente detecta lang=en):
```
Real systems. Real clients. Real deadlines — met.
```

### Badge (`DEVELOPER` → mantener o reemplazar):
> Opción A — mantener `DEVELOPER` (neutro, funciona)
> Opción B — reemplazar por:
```
ARCHITECT
```

---

## SECCIÓN 2 — BACKGROUND TEXT

> **Componente:** `BackgroundText.jsx` → `<h2 className="background-text__heading">`
> **Instrucción:** Reemplaza el copy del heading masivo que aparece con el scroll curtain.

### Texto actual (reemplazar):
```
INNOVA,
CONSTRUYE CONMIGO,
DESCUBRE EL VALOR.
```

### Texto nuevo — ES/EN híbrido (3 líneas, cada una rompe en su propia línea con `<br />`):
```
BUILD
WITHOUT
NOISE.
```

> **Nota al agente:** Fuente `var(--font-pech)` se mantiene. Solo cambia el string interno.
> Si el cliente pide versión en español, usar:
```
CONSTRUYE
SIN
RUIDO.
```

---

## SECCIÓN 3 — NAV LINKS

> **Componente:** `Header.jsx` → `<nav className="nav-links">`
> **Instrucción:** Reemplaza los hrefs vacíos `#` con rutas reales cuando estén disponibles.
> Por ahora inyecta solo los labels correctos.

```jsx
// Labels actuales: About · Gallery
// Labels nuevos:
<a href="#about"    className="nav-link">Work</a>
<a href="#proyectos" className="nav-link">Projects</a>
<a href="https://github.com/UziPech" className="nav-link" target="_blank" rel="noopener noreferrer">GitHub</a>
```

---

## SECCIÓN 4 — PROYECTOS

> **Componente destino:** Crear nuevo componente `ProjectsSection.jsx` o inyectar en `ScrollContent.jsx` sección 4+.
> **Estructura:** 3 tarjetas. Cada tarjeta tiene los campos definidos abajo.
> **Instrucción al agente:** Usa los valores exactos. No parafrasees. No traduzcas el EN a ES ni viceversa.

---

### PROJECT 01 — BYFROST

```yaml
index:        "01 / 03"
tags:         [Full-Stack, SaaS, Solo Build]

title_en:     "Byfrost"
subtitle_en:  "Academic Infrastructure"          # En itálica en el diseño
title_es:     "Plataforma de repositorio académico gamificado"

statement_en: |
  Built alone in 4 days. A complete academic repository ecosystem —
  gamified, collaborative, real-time.

detail_es: |
  Las instituciones educativas almacenan conocimiento sin estructura. Byfrost lo cambia:
  rol de acceso por correo institucional, documentación colaborativa en tiempo real,
  sistema de puntos y rankings, exportación a PDF y panel administrativo con dashboard live.
  No fue un ejercicio académico. Es un producto vendible.

impact:
  number: "4"
  label_es: "días. Sistema completo. Sin equipo."

specs:
  - label: "Stack"
    value: "C# · React · Firebase · Supabase"
  - label: "Architecture"
    value: "Vertical Slice · REST API"
  - label: "Scope"
    value: "Auth · Real-time · PDF Export · Admin"
```

---

### PROJECT 02 — VOGUE PERFUM

```yaml
index:        "02 / 03"
tags:         [eCommerce, Client Work, Security Audit]

title_en:     "Vogue Perfum"
subtitle_en:  "Commerce in Production"
title_es:     "eCommerce real. Cliente real. Auditoría de seguridad incluida."

statement_en: |
  A client's business, running live. Not a demo —
  a system that handles real transactions, real users, real stakes.

detail_es: |
  React + TypeScript en el front, Express 5 en el back, Supabase como base.
  Después del lanzamiento, se ejecutó una auditoría completa de seguridad y rendimiento:
  bypass de autenticación de admin, endpoints sin protección, políticas RLS permisivas —
  todo identificado y resuelto. Lazy loading, optimización del ProductTicker, servicio de imágenes.
  El trabajo no termina en el deploy.

impact:
  number: ~3          # días de entrega
  label_es: "días hasta producción. Cliente satisfecho."

specs:
  - label: "Stack"
    value: "React · TS · Express 5 · Supabase"
  - label: "Delivery"
    value: "~3 días · Producción activa"
  - label: "Post-launch"
    value: "Security audit · Perf. optimization"
```

---

### PROJECT 03 — VIVERO 3D SHOP

```yaml
index:        "03 / 03"
tags:         [3D Commerce, R&D, WebGL]

title_en:     "Vivero 3D"
subtitle_en:  "Commerce, Reimagined"
title_es:     "eCommerce con visualización 3D interactiva y pasarela de pagos"

statement_en: |
  What if you could inspect every plant before you buy it?
  Three-dimensional, interactive, purchasable.

detail_es: |
  Una tienda de plantas donde el producto se puede rotar, acercar y explorar en 3D
  antes de añadirlo al carrito. Integración con MercadoLibre y MercadoPago.
  Un experimento en la dirección correcta: interfaces de producto que hacen
  innecesaria la duda del comprador.

specs:
  - label: "Stack"
    value: "Three.js · WebGL · MercadoPago"
  - label: "Type"
    value: "R&D · Exploration"
  - label: "Concept"
    value: "3D product preview · eCommerce"
```

---

## SECCIÓN 5 — MARQUEE / TECH STRIP

> **Componente:** `Marquee.jsx` → array `techData`
> **Instrucción:** El orden actual está bien. Si se agregan tecnologías, añadirlas al final del array.
> Tecnologías confirmadas para mostrar (en este orden):

```js
const techData = [
  { name: 'React',        icon: <SiReact /> },
  { name: 'Next.js',      icon: <SiNextdotjs /> },
  { name: 'Flutter',      icon: <SiFlutter /> },
  { name: 'Rust',         icon: <SiRust /> },           // aspiracional / en aprendizaje
  { name: 'Supabase',     icon: <SiSupabase /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss /> },
  { name: 'Node.js',      icon: <SiNodedotjs /> },
  // PENDIENTES — agregar cuando el agente tenga los íconos disponibles:
  // { name: 'Three.js',  icon: <SiThreedotjs /> },
  // { name: 'TypeScript',icon: <SiTypescript /> },
  // { name: 'C#',        icon: <SiCsharp /> },
];
```

---

## SECCIÓN 6 — EXPLORE BUTTON / CTA

> **Componente:** `ExploreButton.jsx` y `HeroCTA.jsx`
> **Instrucción:** El label del botón puede variar por sección. Referencia de valores:

```yaml
hero_cta:
  label_es:   "EXPLORAR"
  label_en:   "EXPLORE"
  href:        "/explorar"          # Ruta ya configurada en ExplorarPage

# Si se añade un CTA secundario (ej. en la sección de proyectos):
projects_cta:
  label_es:   "VER PROYECTO"
  label_en:   "VIEW PROJECT"
  href:        "#"                  # Reemplazar con URL real cuando esté disponible
```

---

## SECCIÓN 7 — HOTSPOT CARDS

> **Componente:** `HotspotCard.jsx` → prop `data` recibe `{ title, text }`
> **Instrucción:** Cuando se configuren los hotspots en la escena 3D, usar estos textos.

```yaml
hotspot_1:
  title_es: "Restauración digital"
  text_es:  "Tecnología aplicada a la preservación del conocimiento. Cada sistema es un archivo vivo."

hotspot_2:
  title_es: "Manto Drapeado"
  text_es:  "Detalle escultórico. Precisión en cada vértice. La geometría como narrativa."

hotspot_3:
  title_es: "Base y Roca"
  text_es:  "Fundamento. Todo sistema robusto comienza con una arquitectura sólida y silenciosa."
```

---

## SECCIÓN 8 — TECH STACK (Lenguajes & Frameworks para reclutadores)

> **Componente destino:** `TechStack.jsx` (nuevo) o sección en `ScrollContent.jsx`.
> **Propósito:** Dos bloques únicamente — Lenguajes y Frameworks. Lectura en 5 segundos.
> **Instrucción al agente:** Respetar el orden de cada lista. Es orden de dominio, no alfabético.

---

### COPY DE ENCABEZADO

```yaml
section_label:  "Stack"
headline_en:    "The tools I ship with."
closing_en:     "The stack grows. The fundamentals don't change."
closing_es:     "El stack crece. Los fundamentos no cambian."
```

---

### BLOQUE A — LENGUAJES

> **Instrucción al agente:** Renderizar como fila de chips/pills o grid compacto.
> El campo `level` puede usarse para opacidad visual (production=100%, proficient=70%, learning=50%).

```yaml
languages:
  - name: "JavaScript"
    level: production      # usado en producción con clientes
    si_icon: SiJavascript

  - name: "TypeScript"
    level: production
    si_icon: SiTypescript

  - name: "Dart"
    level: production      # Flutter completo
    si_icon: SiDart

  - name: "C#"
    level: production      # Byfrost — Vertical Slice Architecture
    si_icon: SiCsharp

  - name: "Python"
    level: proficient
    si_icon: SiPython

  - name: "C / C++"
    level: proficient
    si_icon: SiCplusplus

  - name: "Rust"
    level: learning        # interés estratégico — performance e imágenes
    si_icon: SiRust

  - name: "PHP"
    level: proficient
    si_icon: SiPhp

  - name: "Ruby"
    level: proficient
    si_icon: SiRuby

  - name: "Java"
    level: proficient
    si_icon: SiJava
```

---

### BLOQUE B — FRAMEWORKS & HERRAMIENTAS CLAVE

> **Instrucción al agente:** Mismo tratamiento visual que lenguajes pero en bloque separado con su propio label.
> Incluir solo lo que tiene evidencia real en proyectos — no aspiracional salvo que esté marcado `learning`.

```yaml
frameworks:
  # — Frontend —
  - name: "React"
    level: production
    si_icon: SiReact

  - name: "Flutter"
    level: production
    si_icon: SiFlutter

  - name: "Next.js"
    level: proficient
    si_icon: SiNextdotjs

  - name: "Angular"
    level: proficient
    si_icon: SiAngular

  - name: "Tailwind CSS"
    level: production
    si_icon: SiTailwindcss

  - name: "Three.js / R3F"
    level: production      # Jardín Cuántico · Vivero 3D
    si_icon: SiThreedotjs

  - name: "GSAP"
    level: production      # ScrollTrigger · Observer · animaciones portafolio
    si_icon: null          # sin ícono en react-icons/si — usar texto o SVG custom

  # — Backend —
  - name: "Node.js"
    level: production
    si_icon: SiNodedotjs

  - name: "Express"
    level: production
    si_icon: SiExpress

  - name: ".NET"
    level: production
    si_icon: SiDotnet

  - name: "Deno"
    level: learning
    si_icon: SiDeno

  # — Base de datos & BaaS —
  - name: "Supabase"
    level: production
    si_icon: SiSupabase

  - name: "Firebase"
    level: production
    si_icon: SiFirebase

  - name: "MongoDB"
    level: production
    si_icon: SiMongodb

  - name: "PostgreSQL"
    level: proficient
    si_icon: SiPostgresql

  # — DevOps & Deploy —
  - name: "Docker"
    level: proficient
    si_icon: SiDocker

  - name: "Vercel"
    level: production
    si_icon: SiVercel

  - name: "Git"
    level: production
    si_icon: SiGit
```

---

### LEYENDA DE NIVELES

```yaml
production:  "En proyectos reales con clientes o sistemas activos"
proficient:  "Dominio sólido — proyectos propios o académicos reales"
learning:    "Exploración activa con intención estratégica"
```

---

## SECCIÓN 9 — ABOUT / MANIFIESTO

> **Componente destino:** `AboutSection.jsx` (nuevo).
> **Instrucción al agente:** Esta sección tiene dos partes — un statement corto para el hero del About,
> y un manifiesto en párrafos para quien quiera leer más. Inyectar ambos, no solo uno.
> La foto de perfil usa `/assets/images/perfile.jpg` — blanco y negro, estilo editorial, identidad intencional.
> No reemplazar hasta que Uziel lo indique.

---

### IMAGEN DE PERFIL

```yaml
src:    "/assets/images/perfile.jpg"
alt_en: "Uziel Pech — Developer & Architect"
alt_es: "Uziel Pech — Desarrollador y Arquitecto"
note:   "Imagen temporal — se reemplazará por arte de marca personal cuando esté listo."
```

---

### STATEMENT — versión corta (primer impacto visual)

```yaml
statement_en: |
  I don't just write code.
  I build things that work, that last, and that matter.

statement_es: |
  No solo escribo código.
  Construyo cosas que funcionan, que duran y que importan.
```

---

### MANIFIESTO — párrafos completos

> Inyectar como bloques separados, no como lista. Tipografía editorial, no bullets.

```yaml
p1_en: |
  A year and a half ago I had zero experience with computers.
  Today I have systems running in production with real clients.
  That gap is not luck — it's obsession.

p1_es: |
  Hace año y medio no tenía experiencia con computadoras.
  Hoy tengo sistemas en producción con clientes reales.
  Esa distancia no es suerte — es obsesión.

p2_en: |
  My goal as a full-stack developer is to lead projects —
  not just execute them. To see the full picture:
  architecture, security, performance, and the person
  who will use what I build.

p2_es: |
  Mi meta como desarrollador full-stack es liderar proyectos —
  no solo ejecutarlos. Ver el cuadro completo:
  arquitectura, seguridad, rendimiento, y la persona
  que va a usar lo que construyo.

p3_en: |
  On the frontend, I want to win an Awwwards.
  Not as a trophy — as proof that craft and code
  can coexist at the highest level.

p3_es: |
  En el frontend, quiero ganar un Awwwards.
  No como trofeo — como prueba de que el craft y el código
  pueden coexistir al nivel más alto.

p4_en: |
  I work with AI agents, not against them.
  My workflow is an orchestrator + sub-agents pipeline —
  I define what gets built and why.
  The agents execute. I architect.

p4_es: |
  Trabajo con agentes de IA, no en su contra.
  Mi flujo es un pipeline de orquestador + sub-agentes —
  yo defino qué se construye y por qué.
  Los agentes ejecutan. Yo arquitecto.

p5_en: |
  I don't deliver projects just to deliver them.
  Every system I ship is something I'd want to use myself.
  Quality isn't a feature — it's the baseline.

p5_es: |
  No entrego proyectos solo por entregarlos.
  Cada sistema que lanzo es algo que yo mismo querría usar.
  La calidad no es una característica — es el punto de partida.
```

---

### CIERRE — línea final del About

> Una sola línea. Sola. Tipografía grande. La última cosa que el visitante lee.

```yaml
closing_en: "Still learning. Always shipping."
closing_es: "Siempre aprendiendo. Siempre entregando."
```

---

### METAS (bloque secundario opcional)

> Si el diseño incluye sidebar o tarjetas de objetivos.

```yaml
goals:
  - label: "Project Lead"
    detail_es: "Dirigir equipos y decisiones de arquitectura en productos reales"

  - label: "Awwwards"
    detail_es: "Una web ganadora. El frontend como disciplina, no como tarea"

  - label: "Agent Workflow"
    detail_es: "Afinar el pipeline orquestador → sub-agentes. Dominar más lenguajes con él"

  - label: "Rust"
    detail_es: "Primer lenguaje estratégico en la lista. Performance e imágenes"
```

---

## PENDIENTES / TODO PARA EL AGENTE

> Lista de tareas de contenido que aún no tienen texto final. El agente NO debe inventar copy —
> dejar el placeholder hasta que se confirme el texto.

```
[x] About / Manifiesto — COMPLETADO. Ver Sección 9.
[ ] Footer — ¿incluir email de contacto? Confirmar con Uziel.
[ ] Contacto — ningún canal definido aún (email, LinkedIn, formulario). CRÍTICO para reclutadores.
[ ] Meta tags (SEO) — title, description, og:image. Pendiente de definir.
[ ] Hotspot hrefs de proyectos — URLs de repositorios o demos en vivo.
[x] Imagen de perfil — ruta confirmada: `/assets/images/perfile.jpg`. Ver Sección 9.
[ ] ExplorarPage — ¿necesita copy propio o es puramente visual?
[ ] TechStack.jsx — componente aún no creado. Sección 8 tiene todo el contenido listo para inyectar.
[ ] AboutSection.jsx — componente aún no creado. Sección 9 tiene todo el contenido listo para inyectar.
[ ] GSAP logo/ícono custom — SiGsap no existe en react-icons. Usar SVG propio o texto plano.
[ ] Arte de marca personal — reemplazará perfile.jpg cuando esté listo. Uziel lo confirmará.
[ ] SaaS Gastronómico y Enterprise Asset Manager — ¿incluir como proyectos adicionales? Confirmar con Uziel.
[ ] Game Dev (Flame Engine) — ¿mención en About o sección propia?
```

---

## REGLAS EDITORIALES PARA EL AGENTE

> Seguir siempre estas reglas al inyectar o modificar texto en el proyecto.

```
1. NO reescribir el copy. Inyectar literal como aparece en este documento.
2. NO traducir automáticamente. Cada campo tiene su idioma definido — respetarlo.
3. Tono: mínimo, preciso, sin adjetivos gratuitos. Si una frase puede ser más corta, córtala.
4. Números: siempre en dígitos ("4 días", no "cuatro días").
5. Puntuación: los em-dash (—) son intencionales. No reemplazar por guiones simples.
6. Mayúsculas: los headlines en ALL CAPS son decisión de diseño. No cambiar casing.
7. Cuando un campo diga "pendiente", dejar comentario `{/* TODO: copy pendiente */}` en el JSX.
```

---

*Última actualización: sesión de diseño editorial con Claude — Jardín Cuántico Portfolio (About + Stack completos)*
*Owner: UziPech · Mérida, Yucatán*
