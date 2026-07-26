# Setup Notes

## Frontend

```powershell
cd truthforge-ai/frontend
npm install
npm run dev
```

Default URL: `http://127.0.0.1:5173`

## Backend

```powershell
cd truthforge-ai/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e ".[dev,ai]"
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Default API URL: `http://127.0.0.1:8000/api/v1`

## Health Check

```powershell
Invoke-RestMethod http://127.0.0.1:8000/api/v1/health
```
