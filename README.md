# Project: Full Stack Chord Recognition App

This project consists of a **Next.js/React frontend** and a **FastAPI backend** (BTC-ISMIR19) for audio chord recognition and song management.

---

## 📁 Folder Structure

```
project-1/
│
├── BTC-ISMIR19/         # FastAPI backend
│   ├── requirements.txt
│   └── ... (FastAPI code)
│
├── src/                       # Next.js frontend
│   └── ... (frontend code)
│
├── prisma/                    # Prisma schema for database
│
├── .env                       # Environment variables (see below)
└── ...
```

---

## 🚀 Quick Start

### 1. **Clone the repository**

```sh
git clone <your-repo-url>
cd project-1
```

---

### 2. **Set up environment variables**

- Copy `.env.example` to `.env` and fill in your values (DB, secrets, etc).
- For the backend, ensure any required config files (e.g., `run_config.yaml`) are present in `btc-ismir19-myOwn`.

---

### 3. **Install dependencies**

#### Frontend (Next.js)

```sh
cd project-1
pnpm install   # or yarn install / npm install
```

#### Backend (FastAPI)

```sh
cd BTC-ISMIR19
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

### 4. **Set up the database**

If using PostgreSQL (recommended):

```sh
# From project root
pnpm prisma migrate dev
# or
npx prisma migrate dev
```

Or use provided `start-database.sh` script.

---

### 5. **Run the backend (FastAPI)**

```sh
cd BTC-ISMIR19
source .venv/bin/activate
uvicorn main:app --reload
# or if your entrypoint is different:
# uvicorn api:app --reload
```

- The backend will be available at [http://127.0.0.1:8000](http://127.0.0.1:8000)
- API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

### 6. **Run the frontend (Next.js)**

```sh
cd project-1
pnpm dev
# or
npm run dev
# or
yarn dev
```

- The frontend will be available at [http://localhost:3000](http://localhost:3000)

---


## 📄 License

MIT (or your chosen license)
