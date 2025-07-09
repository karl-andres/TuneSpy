# Project: Full Stack Chord Recognition App

This project consists of a **Next.js frontend**, a **FastAPI backend (BTC-ISMIR19 by Jonggwon Park)**, and a **PostgreSQL database accessed via Prisma ORM** for audio chord recognition and song management.

---
# Key Features

- **Audio Upload & Chord Detection:**  
  Users can upload audio files (MP3 or WAV), and the integrated AI model will automatically detect and analyze the chords being played.

- **Large Vocabulary Mode:**  
  When uploading audio, users can enable a "large vocabulary" option, allowing the deep learning model to perform more accurate and detailed chord analysis.

- **Personal Song Library:**  
  Each user has access to a personal library where they can view all their uploaded songs and select any song to see its detected chords.

- **Authentication & Account Management:**  
  Secure authentication is implemented using NextAuth.js Credentials Provider. Users must create an account and log in to access the application's main features.

- **User-Friendly Interface:**  
  The app provides a clean, intuitive interface for uploading files, managing your song library, and viewing chord progressions.

---
## Quick Start

### 1. **Clone the repository**

```sh
git clone my-repo-url
cd TuneSpy
```

---

### 2. **Set up environment variables**

Copy `.env.example` to `.env` and fill in your values (DB and secret).

---

### 3. **Install dependencies**

#### Frontend (Next.js)

```sh
cd TuneSpy
npm install
```

#### Backend (FastAPI)

```sh
cd BTC-ISMIR19
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### 4. **Set up the database (Prisma)**

```sh
# From project root
npm run db:push
```

---

### 5. **Run the backend (FastAPI)**

```sh
cd BTC-ISMIR19
source .venv/bin/activate
uvicorn api:app --reload
```

---

### 6. **Run the frontend (Next.js)**

```sh
cd TuneSpy
npm run dev
```
---
