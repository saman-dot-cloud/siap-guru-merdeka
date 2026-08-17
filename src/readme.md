\## Overview



This project uses the following tech stack:

\- Vite

\- Typescript

\- React Router v7 (all imports from `react-router` instead of `react-router-dom`)

\- React 19 (for frontend components)

\- Tailwind v4 (for styling)

\- Shadcn UI (for UI components library)

\- Lucide Icons (for icons)

\- Convex (for backend \& database)

\- Convex Auth (for authentication)

\- Framer Motion (for animations)

\- Three js (for 3d models)



All relevant files live in the 'src' directory.



Use bun for the package manager.



\## Setup



This project is set up already and running on a cloud environment, as well as a convex development in the sandbox.



\## Environment Variables



The project is set up with project specific CONVEX\_DEPLOYMENT and VITE\_CONVEX\_URL environment variables on the client side.



The convex server has a separate set of environment variables that are accessible by the convex backend.



Currently, these variables include auth-specific keys: JWKS, JWT\_PRIVATE\_KEY, and SITE\_URL.





\# Using Authentication (Important!)



You must follow these conventions when using authentication.



\## Auth is already set up.



All convex authentication functions are already set up. The auth currently uses email OTP and anonymous users, but can support more.



The email OTP configuration is defined in `src/convex/auth/emailOtp.ts`. DO NOT MODIFY THIS FILE.



Also, DO NOT MODIFY THESE AUTH FILES: `src/convex/auth.config.ts` and `src/convex/auth.ts`.



\## Using Convex Auth on the backend



On the `src/convex/users.ts` file, you can use the `getCurrentUser` function to get the current user's data.



\## Using Convex Auth on the frontend



The `/auth` page is already set up to use auth. Navigate to `/auth` for all log in / sign up sequences.



You MUST use this hook to get user data. Never do this yourself without the hook:

```typescript

import { useAuth } from "@/hooks/use-auth";



const { isLoading, isAuthenticated, user, signIn, signOut } = useAuth();

```



\## Protected Routes



The starter `/dashboard` route is protected with `RequireAuth`, which sends

signed-out users to `/auth?returnTo=<current route>`. Extend that page for the

product's authenticated experience, and reuse `RequireAuth` when adding another

protected route.



\## Auth Page



The auth page is defined in `src/pages/Auth.tsx`. Send sign-in and sign-up actions

to `/auth`.



\## Authorization



You can perform authorization checks on the frontend and backend.



On the frontend, you can use the `useAuth` hook to get the current user's data and authentication state.



You should also be protecting queries, mutations, and actions at the base level, checking for authorization securely.



\## Adding a redirect after auth



The `/auth` route in `src/main.tsx` redirects to `/dashboard` by default. If the

product's main authenticated route is different, update `redirectAfterAuth` to

that route. A validated same-origin `returnTo` query parameter takes priority so

users can resume the protected page they originally requested. Never leave an

authenticated product redirecting back to the public landing page.



\## Complete authenticated products



When the requested product implies accounts, a workspace, a dashboard, or other

signed-in functionality, the task is not complete with only a landing page and

auth form. Build the main authenticated experience, protect its route, and verify

that signing in reaches it.



\# Frontend Conventions



You will be using the Vite frontend with React 19, Tailwind v4, and Shadcn UI.



Generally, pages should be in the `src/pages` folder, and components should be in the `src/components` folder.



Shadcn primitives are located in the `src/components/ui` folder and should be used by default.



\## Page routing



Your page component should go under the `src/pages` folder.



When adding a page, update the react router configuration in `src/main.tsx` to include the new route you just added.



\## Shad CN conventions



Follow these conventions when using Shad CN components, which you should use by default.

\- Remember to use "cursor-pointer" to make the element clickable

\- For title text, use the "tracking-tight font-bold" class to make the text more readable

\- Always make apps MOBILE RESPONSIVE. This is important

\- AVOID NESTED CARDS. Try and not to nest cards, borders, components, etc. Nested cards add clutter and make the app look messy.

\- AVOID SHADOWS. Avoid adding any shadows to components. stick with a thin border without the shadow.

\- Avoid skeletons; instead, use the loader2 component to show a spinning loading state when loading data.





\## Landing Pages



You must always create good-looking designer-level styles to your application. 

\- Make it well animated and fit a certain "theme", ie neo brutalist, retro, neumorphism, glass morphism, etc



Use known images and emojis from online.



If the user is logged in already, show the get started button to say "Dashboard" or "Profile" instead to take them there.



\## Responsiveness and formatting



Make sure pages are wrapped in a container to prevent the width stretching out on wide screens. Always make sure they are centered aligned and not off-center.



Always make sure that your designs are mobile responsive. Verify the formatting to ensure it has correct max and min widths as well as mobile responsiveness.



\- Always create sidebars for protected dashboard pages and navigate between pages

\- Always create navbars for landing pages

\- On these bars, the created logo should be clickable and redirect to the index page



\## Animating with Framer Motion



You must add animations to components using Framer Motion. It is already installed and configured in the project.



To use it, import the `motion` component from `framer-motion` and use it to wrap the component you want to animate.





\### Other Items to animate

\- Fade in and Fade Out

\- Slide in and Slide Out animations

\- Rendering animations

\- Button clicks and UI elements



Animate for all components, including on landing page and app pages.



\## Three JS Graphics



Your app comes with three js by default. You can use it to create 3D graphics for landing pages, games, etc.





\## Colors



You can override colors in: `src/index.css`



This uses the oklch color format for tailwind v4.



Always use these color variable names.



Make sure all ui components are set up to be mobile responsive and compatible with both light and dark mode.



Set theme using `dark` or `light` variables at the parent className.



\## Styling and Theming



When changing the theme, always change the underlying theme of the shad cn components app-wide under `src/components/ui` and the colors in the index.css file.



Avoid hardcoding in colors unless necessary for a use case, and properly implement themes through the underlying shad cn ui components.



When styling, ensure buttons and clickable items have pointer-click on them (don't by default).



Always follow a set theme style and ensure it is tuned to the user's liking.



\## Toasts



You should always use toasts to display results to the user, such as confirmations, results, errors, etc.



Use the shad cn Sonner component as the toaster. For example:



```

import { toast } from "sonner"



import { Button } from "@/components/ui/button"

export function SonnerDemo() {

&#x20; return (

&#x20;   <Button

&#x20;     variant="outline"

&#x20;     onClick={() =>

&#x20;       toast("Event has been created", {

&#x20;         description: "Sunday, December 03, 2023 at 9:00 AM",

&#x20;         action: {

&#x20;           label: "Undo",

&#x20;           onClick: () => console.log("Undo"),

&#x20;         },

&#x20;       })

&#x20;     }

&#x20;   >

&#x20;     Show Toast

&#x20;   </Button>

&#x20; )

}

```



Remember to import { toast } from "sonner". Usage: `toast("Event has been created.")`



\## Dialogs



Always ensure your larger dialogs have a scroll in its content to ensure that its content fits the screen size. Make sure that the content is not cut off from the screen.



Ideally, instead of using a new page, use a Dialog instead. 



\# Using the Convex backend



You will be implementing the convex backend. Follow your knowledge of convex and the documentation to implement the backend.



\## The Convex Schema



You must correctly follow the convex schema implementation.



The schema is defined in `src/convex/schema.ts`.



Do not include the `\_id` and `\_creationTime` fields in your queries (it is included by default for each table).

Do not index `\_creationTime` as it is indexed for you. Never have duplicate indexes.





\## Convex Actions: Using CRUD operations



When running anything that involves external connections, you must use a convex action with "use node" at the top of the file.



You cannot have queries or mutations in the same file as a "use node" action file. Thus, you must use pre-built queries and mutations in other files.



You can also use the pre-installed internal crud functions for the database:



```ts

// in convex/users.ts

import { crud } from "convex-helpers/server/crud";

import schema from "./schema.ts";



export const { create, read, update, destroy } = crud(schema, "users");



// in some file, in an action:

const user = await ctx.runQuery(internal.users.read, { id: userId });



await ctx.runMutation(internal.users.update, {

&#x20; id: userId,

&#x20; patch: {

&#x20;   status: "inactive",

&#x20; },

});

```





\## Common Convex Mistakes To Avoid



When using convex, make sure:

\- Document IDs are referenced as `\_id` field, not `id`.

\- Document ID types are referenced as `Id<"TableName">`, not `string`.

\- Document object types are referenced as `Doc<"TableName">`.

\- Keep schemaValidation to false in the schema file.

\- You must correctly type your code so that it passes the type checker.

\- You must handle null / undefined cases of your convex queries for both frontend and backend, or else it will throw an error that your data could be null or undefined.

\- Always use the `@/folder` path, with `@/convex/folder/file.ts` syntax for importing convex files.

\- This includes importing generated files like `@/convex/\_generated/server`, `@/convex/\_generated/api`

\- Remember to import functions like useQuery, useMutation, useAction, etc. from `convex/react`

\- NEVER have return type validators.



\# 📐 Dokumentasi Arsitektur — Siap Guru (Sistem Perangkat Ajar Kurikulum Merdeka)



\*\*Siap Guru\*\* adalah aplikasi web untuk membantu guru menyusun perangkat ajar

Kurikulum Merdeka (CP → TP → ATP → KKTP → PPM → Nilai → Cetak) secara digital,

efisien, dan otomatis. Dikembangkan di atas template Freebuff: React 19 +

TypeScript + Vite + Tailwind v4 + shadcn/ui + Framer Motion di frontend, dan

Convex (backend + database realtime) dengan Convex Auth untuk autentikasi.



\## Arsitektur Aplikasi



```

Browser (React SPA)

&#x20; ├── Landing / Auth (email OTP \& anonymous)

&#x20; ├── Dashboard (dilindungi RequireAuth)

&#x20; │     ├── Guru      → 10 modul administrasi pembelajaran

&#x20; │     ├── Kepsek    → panel supervisi \& matriks kelayakan

&#x20; │     └── Admin     → data master \& rekap sekolah

&#x20; └── Convex client (reactive query/mutation/action)

&#x20;          │

&#x20;          ▼

Convex backend (serverless TypeScript)

&#x20; ├── auth.ts / auth.config.ts / emailOtp.ts  (Convex Auth, jangan diubah)

&#x20; ├── users.ts / profiles.ts                   (autentikasi \& RBAC)

&#x20; ├── admin.ts / supervision.ts                (panel kepsek \& admin)

&#x20; ├── rombels.ts / students.ts / attendance.ts (data master mengajar)

&#x20; ├── atp.ts / kktp.ts / ppm.ts / grades.ts / lkpd.ts (modul perangkat ajar)

&#x20; └── \_generated/                              (kode hasil codegen — jangan diedit manual)

```



\## Hak Akses (RBAC)



| Peran          | Ruang lingkup                                                                |

| -------------- | ---------------------------------------------------------------------------- |

| `guru`         | Profil, rombel \& siswa, presensi/jurnal, ATP, KKTP, PPM, nilai, LKPD, cetak.  |

| `kepsek`       | Dashboard pengawasan + matriks kelayakan berkas seluruh pendidik.             |

| `admin`        | Rekap seluruh sekolah, data guru, rombel \& siswa, master mapel \& Fase A–F.    |



Hak akses disimpan pada tabel `users.role` (ditetapkan via `upsertProfile`),

profil lengkap pada tabel `profiles.role`. Query backend memverifikasi peran

sebelum mengembalikan data (mis. `getSupervisionMatrix` dan `admin.\*` hanya

untuk `kepsek`/`admin`).



\## Struktur Basis Data (Convex)



| Tabel         | Isi utama                                                                 | Indeks                    |

| ------------- | ------------------------------------------------------------------------- | ------------------------- |

| `users`       | Akun + `role` (guru/kepsek/admin)                                         | `email`                   |

| `profiles`    | Identitas pendidik, instansi, NIP, mapel, nama kepsek utk tanda tangan    | `by\_user`                 |

| `rombels`     | Rombongan belajar: nama, tingkat, mapel, TA, semester                      | `by\_user`                 |

| `students`    | Peserta didik: NISN, jenis kelamin                                        | `by\_rombel`, `by\_user`    |

| `attendance`  | Presensi \& jurnal harian per tanggal (entries status hadir/sakit/izin/alpa)| `by\_rombel\_tanggal`       |

| `atps`        | Alur Tujuan Pembelajaran: fase, elemen, CP, TP, alokasi, urutan, semester | `by\_rombel`, `by\_user`    |

| `kktps`       | Interval KKTP + matriks per TP                                             | `by\_rombel`, `by\_user`    |

| `ppms`        | Perencanaan pembelajaran (blok 8-3-3-4)                                   | `by\_rombel`, `by\_user`    |

| `grades`      | Daftar nilai (Tugas/UH/UTS/UAS/Praktik)                                   | `by\_rombel`, `by\_user`    |

| `lkpds`       | Lampiran LKPD, media, bahan ajar                                          | `by\_rombel`, `by\_user`    |



Data master mata pelajaran dan Fase A–F didefinisikan sebagai konstanta

terpusat di `src/lib/school.ts` (`MAPEL\_MASTER`, `FASE\_MASTER`) sehingga

referensi kurikulum konsisten di seluruh modul.



\## Pipeline Generator Kurikulum (CP → TP → ATP)



Engine deterministik di `src/lib/cp-generator.ts` (tanpa kunci API):



1\. \*\*Ingesti \& klasifikasi elemen\*\* — pemindaian teks CP, pengelompokan ke

&#x20;  elemen mapel (kamus per mata pelajaran).

2\. \*\*Ekstraksi KKO \& konten (NER)\*\* — kalimat CP dibedah menjadi Kompetensi

&#x20;  (Taksonomi Bloom C1–C6) dan Ruang Lingkup Materi.

3\. \*\*Generasi TP\*\* — formula Kompetensi + Konten + Variasi Konteks Nyata.

4\. \*\*Sekuensing DAG\*\* — urutan elemen mudah → sulit (scaffolding).

5\. \*\*Semester splitting\*\* — kapasitas JP riil (18 minggu efektif × JP/minggu),

&#x20;  load balancing antar semester dengan deviasi maksimal ±4 JP.

6\. \*\*Dimensi Profil Lulusan\*\* — penyematan otomatis 8 dimensi per TP.



Hasil disimpan ke tabel `atps` dan dicetak lewat Pusat Dokumen \& Ekspor

(`PrintDocuments.tsx`).





