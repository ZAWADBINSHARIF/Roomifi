# Roomifi Presentation

## Slide 1 - Title
**Roomifi**

AI-Powered Floorplan Color Enhancement Platform

Convert 2D pencil floor plans and room drawings into polished color-enhanced visualizations.

---

## Slide 2 - Project Summary
**What is Roomifi?**

Roomifi is a web application that transforms 2D room floor plans into more vivid, color-enhanced architectural visualizations.

It is built using modern React Router architecture and integrates AI image generation through Puter.js.

---

## Slide 3 - Problem Statement
**Why this project exists**

- Architects, interior designers, and students often start with hand-drawn or pencil floor plans.
- These sketches are hard to visualize as completed spaces.
- Roomifi turns raw 2D drawings into a visual preview that is easier to understand and present.

---

## Slide 4 - Project Vision
**What Roomifi delivers**

- Fast conversion from 2D plan to visual result.
- Color enhancement and style refinement.
- Before/after comparison.
- Exportable render images for presentations.

---

## Slide 5 - User Journey
**Step-by-step flow**

1. User visits the homepage.
2. User signs in via Puter authentication.
3. User uploads a floor plan image.
4. The image is converted into Base64.
5. The app creates a new project record.
6. The user is redirected to the visualizer page.
7. AI processes the image and generates a color-enhanced render.
8. Result is saved, displayed, and available for export.

---

## Slide 6 - Architecture Overview
**How the app is structured**

- Frontend: React + React Router + TypeScript + Tailwind CSS
- AI integration: Puter AI via `puter.ai.txt2img`
- Hosting/storage: Puter KV + Puter filesystem hosting
- Worker endpoints: custom backend APIs called through Puter workers

---

## Slide 7 - Project Structure
**Key folders and files**

```
app/
├── routes/
│   ├── home.tsx
│   └── visualizer.$id.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Upload.tsx
│   └── ui/Button.tsx
lib/
├── ai.action.ts
├── puter.action.ts
├── puter.hosting.ts
├── utils.ts
├── constants.ts
```

---

## Slide 8 - Routes and Pages
**React Router setup**

`app/routes.ts` config:

```ts
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('visualizer/:id', './routes/visualizer.$id.tsx'),
] satisfies RouteConfig;
```

This creates:
- `/` → Home page
- `/visualizer/:id` → Project visualizer page

---

## Slide 9 - Root App and Auth Context
**Global app state and auth**

`app/root.tsx` manages auth state and passes it to child routes:

```ts
const refreshAuth = async () => {
  const user = await getCurrentUser();
  setAuthState({
    isSignedIn: !!user,
    userId: user?.uuid || null,
    userName: user?.username || null,
  });
};

return (
  <main>
    <Outlet context={{ ...authState, refreshAuth, signIn, signOut }} />
  </main>
);
```

This allows sharing login status across all pages.

---

## Slide 10 - Upload Flow
**How the upload works**

`app/components/Upload.tsx` handles drag-and-drop and file selection.

Key steps:
- Read the selected image using `FileReader`
- Convert the image to Base64
- Simulate progress feedback
- Call `onComplete(base64Data)` when ready

Snippet:

```ts
const reader = new FileReader();
reader.onloadend = () => {
  const base64Data = reader.result as string;
  onComplete?.(base64Data);
};
reader.readAsDataURL(file);
```

---

## Slide 11 - Project Creation and Storage
**How a new project is created**

`app/routes/home.tsx` uploads the image and creates a project:

```ts
const saved = await createProject({ item: newItem, visibility: 'private' });
```

`lib/puter.action.ts` does the heavy lifting:

- Hosts source image via Puter
- Hosts rendered image when available
- Sends project metadata to backend worker endpoint

---

## Slide 12 - Puter.js Role
**Why Puter.js is used**

Puter.js provides:
- Authentication: `puter.auth.signIn()` and `puter.auth.getUser()`
- Key-value storage: `puter.kv.get()` and `puter.kv.set()`
- File hosting: `puter.fs.write()` and hosted URLs
- Worker execution: `puter.workers.exec()`
- AI integration: `puter.ai.txt2img()`

This means Roomifi can handle auth, storage, hosting, and AI within one ecosystem.

---

## Slide 13 - Benefits of Puter.js
**Why this technology is valuable**

- Fast integration with fewer backend services
- Built-in secure auth and storage
- Simplifies file hosting and URL generation
- Supports AI model calls directly from the frontend
- Reduces infrastructure overhead

Puter is especially useful for prototypes and rapid AI-powered applications.

---

## Slide 14 - Image Processing Pipeline
**How the image is sent to AI**

1. Convert the uploaded image to Base64 in the browser.
2. If the image URL is remote, fetch it as a blob and convert it.
3. Call `puter.ai.txt2img()` with the prompt and image payload.
4. Receive a render result from Gemini.
5. Convert the returned image URL to Base64 if needed.
6. Save the render and display it.

---

## Slide 15 - AI Prompt Details
**The ROOMIFY_RENDER_PROMPT**

This prompt tells the model exactly what to do:

```ts
export const ROOMIFY_RENDER_PROMPT = `
TASK: Convert the input 2D floor plan into a **photorealistic, top‑down 3D architectural render**.

STRICT REQUIREMENTS (do not violate):
1) **REMOVE ALL TEXT**: ...
2) **GEOMETRY MUST MATCH**: ...
3) **TOP‑DOWN ONLY**: ...
4) **CLEAN, REALISTIC OUTPUT**: ...
5) **NO EXTRA CONTENT**: ...

...`
```

This prompt ensures the AI preserves structure, removes labels, avoids perspective, and delivers clean architectural visuals.

---

## Slide 16 - Visualizer Page
**Preview and comparison**

`app/routes/visualizer.$id.tsx` loads the selected project, then either:
- displays an existing rendered image, or
- triggers AI generation and updates the project

It also provides:
- export/download button
- side-by-side before/after comparison slider

---

## Slide 17 - Code Example: AI Generation
**How the render is generated**

`lib/ai.action.ts`:

```ts
export const generate3DView = async ({ sourceImage }) => {
  const dataUrl = sourceImage.startsWith('data:')
    ? sourceImage
    : await fetchAsDataUrl(sourceImage);

  const response = await puter.ai.txt2img(ROOMIFY_RENDER_PROMPT, {
    provider: "gemini",
    model: "gemini-2.5-flash-image-preview",
    input_image: base64Data,
    input_image_mime_type: mimeType,
    ratio: { w: 1024, h: 1024 },
  });

  const rawImageUrl = (response as HTMLImageElement).src ?? null;
  const renderedImage = rawImageUrl.startsWith('data:')
    ? rawImageUrl : await fetchAsDataUrl(rawImageUrl);

  return { renderedImage, renderedPath: undefined };
};
```

---

## Slide 18 - Deployment and Environment
**How to run Roomifi**

Environment variable:

```env
VITE_PUTER_WORKER_URL=your_worker_api_url
```

Scripts:

```bash
npm install
npm run dev
npm run build
npm run typecheck
```

Vite and React Router handle development and production builds.

---

## Slide 19 - Screenshot Example
**Visual example**

Insert a screenshot showing the conversion flow:

- left: original floorplan sketch
- right: color-enhanced output

If you have an image file, add it here with Markdown:

```md
![Roomifi before and after](./roomifi-conversion.png)
```

---

## Slide 20 - Benefits for University Presentation
**Why this project matters**

- Demonstrates AI-assisted design workflows
- Shows practical use of modern web and serverless tech
- Uses a real prompt strategy for controlled AI output
- Integrates frontend, backend, and cloud services
- Provides a clear business case for architecture/student tools

---

## Slide 21 - Future Improvements
**Paths to extend Roomifi**

- Add real upload progress tracking
- Improve error handling and retries
- Add project management features
- Support mobile-friendly UI
- Add multi-model AI provider support
- Build a dedicated backend for saved project data

---
