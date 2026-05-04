# 🏠 Roomifi — AI-Powered Room Visualizer

Transform any room image into a stunning 3D-rendered visualization using AI.

Roomifi is a full-stack web application built with modern React Router architecture and powered by AI image generation. It allows users to upload room images and instantly generate enhanced, styled 3D visualizations with before/after comparison.

---

## 🚀 Features

* 🔐 Authentication (via Puter)
* 📤 Drag & drop image upload
* 🧠 AI-powered 3D room rendering
* 🖼️ Before/After comparison slider
* 💾 Project saving & retrieval
* 📥 Export/download rendered images
* ⚡ Fast SPA experience with SSR support

---

## 🏗️ Tech Stack

### Frontend

* React 19
* React Router v7 (SSR-enabled)
* TypeScript
* Tailwind CSS
* Vite

### UI / UX

* lucide-react (icons)
* react-compare-slider (image comparison)

### Backend / Platform

* Puter.js

  * Auth
  * Storage (KV)
  * File Hosting
  * Worker execution

### AI

* Gemini 2.5 Flash Image (via Puter AI)

---

## 📁 Project Structure

```
app/
├── routes/
│   ├── home.tsx
│   └── visualizer.$id.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Upload.tsx
│   └── Button.tsx
├── actions/
│   ├── ai.action.ts
│   ├── puter.action.ts
│   └── puter.hosting.ts
├── utils/
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── type.d.ts
└── root.tsx
```

---

## 🔄 Application Flow

1. User visits homepage
2. Signs in using Puter
3. Uploads a room image
4. Image is converted to Base64
5. Project is created via Puter worker
6. User is redirected to visualizer page
7. AI generates a 3D rendered version (if not already exists)
8. Result is stored and displayed
9. User can compare and export the result

---

## 🧠 AI Rendering

Roomifi uses a custom prompt (`ROOMIFY_RENDER_PROMPT`) to ensure:

* Accurate room structure preservation
* Realistic lighting and materials
* Clean, aesthetic 3D-style output

Rendering is done via:

```ts
puter.ai.txt2img({
  model: "gemini-2.5-flash-image-preview",
  prompt: ROOMIFY_RENDER_PROMPT
})
```

---

## 🔐 Authentication

Handled entirely via Puter:

* `signIn()`
* `signOut()`
* `getCurrentUser()`

Auth state is globally managed through React Router `Outlet` context.

---

## ☁️ Storage & Hosting

* Images uploaded via `puter.fs`
* Hosted URLs generated dynamically
* Project metadata stored via Puter KV
* Backend communication through worker endpoints

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
VITE_PUTER_WORKER_URL=your_worker_api_url
```

---

## 🧪 Development

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

### Type checking

```bash
npm run typecheck
```

### Build

```bash
npm run build
```

### Serve production build

```bash
npm run serve
```

---

## ⚠️ Important Notes

* ❗ Backend worker API is **not included** in this repository
* ❗ App depends heavily on Puter platform services
* ❗ Without worker endpoints, project persistence will not function

---

## 📌 Known Limitations

* No offline support
* No retry mechanism for failed AI generation
* Limited error handling for network/API failures
* Upload progress is simulated (not actual)

---

## 🛠️ Future Improvements

* ✅ Real upload progress tracking
* 🔁 Retry & fallback for AI generation
* 📊 Project management dashboard
* 🧩 Modular AI provider support (OpenAI, local models, etc.)
* 📱 Mobile responsiveness improvements
* 🧪 Unit & integration testing

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License

MIT License — feel free to use and modify.

---

## 💡 Inspiration

Roomifi aims to simplify interior visualization by combining:

* AI generation
* Fast web technologies
* Seamless user experience

---
