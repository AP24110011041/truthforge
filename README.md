# TIGAS — CNN-Based Image Authenticity Detection

**TIGAS** is a Convolutional Neural Network (CNN) research prototype that classifies an input image as **REAL** or **FAKE**. The project combines a PyTorch-based image-classification model, a FastAPI prediction interface, and a React + TypeScript web interface.

> **Research-use disclaimer:** TIGAS is an experimental classifier, not a forensic verification system. Its predictions can be wrong. A model score is not proof that an image is authentic or manipulated, and this prototype should not be used for consequential decisions.

## Project overview

| Item | Description |
|---|---|
| Project | TIGAS |
| Task | Binary image classification |
| Classes | REAL and FAKE |
| Model family | Convolutional Neural Network (CNN) |
| Model framework | PyTorch |
| API | FastAPI |
| Frontend | React, TypeScript, Vite |
| Model input | 512 × 512 pixels |
| Prediction endpoint | `POST /api/v1/tigas/predict` |

The frontend accepts JPEG, PNG, BMP, GIF, and WebP uploads up to 10 MiB. The API is designed to return the predicted class, class scores, original dimensions, model input dimensions, and preprocessing metadata.

## How it works

1. The user selects an image in the TIGAS web interface.
2. The frontend sends the image as multipart form data to the FastAPI prediction endpoint.
3. The backend validates the input and applies the model's configured preprocessing policy.
4. The CNN produces scores for the REAL and FAKE classes.
5. The API returns the prediction and supporting metadata for display in the frontend.

The inference implementation uses the class mapping **REAL = 0** and **FAKE = 1**. Keep this mapping consistent across training, evaluation, checkpoint metadata, and inference.

## Evaluation snapshot

The recorded evaluation run reported:

| Metric | Threshold 0.5 | Validation-selected threshold |
|---|---:|---:|
| Accuracy | 82.07% | 84.02% |
| Balanced accuracy | 81.47% | 83.66% |
| Macro F1 | 81.33% | 83.74% |
| ROC-AUC | 89.75% | 89.75% |

The secondary threshold (0.665368) was selected using validation data. It is reported separately from the default 0.5 result and must not be presented as an independently selected test threshold.

**Important evaluation limitation:** the evaluation record is flagged with a leakage/audit caveat. Cross-partition near-duplicate candidates have required additional review, so these numbers must be treated as provisional rather than as proof of leakage-free generalization. Do not interpret them as a guaranteed real-world accuracy rate. Re-run the final evaluation after resolving the duplicate audit and document the exact dataset version, split strategy, and checkpoint used.

## Repository publication status

The TIGAS frontend page and route have been added to this repository. The public GitHub snapshot has **not yet been verified as a complete, clean-clone runnable release**. The TIGAS inference module, model implementation, preprocessing module, checkpoint, and training/evaluation assets were present in the local development workspace but were not included in the frontend-only GitHub update.

Until those files are reviewed and committed, treat this repository as a partially published project. The prediction endpoint will not work from a fresh clone unless the matching backend implementation and checkpoint are also provided.

## Repository layout

```text
truthforge/
├── frontend/
│   └── src/
│       ├── pages/
│       │   └── TigasPredictPage.tsx
│       ├── lib/
│       ├── routes.tsx
│       └── utils/
├── backend/
│   ├── api/
│   ├── models/
│   └── utils/
├── docs/
└── README.md
```

Some legacy TruthForge scaffolding files and modules may still exist in the repository. They are not part of the TIGAS project scope and should not be mistaken for implemented TIGAS functionality.

## Run the frontend

Requirements: Node.js and npm.

```powershell
cd frontend
npm install
npm run dev
```

The Vite development server will print the local URL to open in your browser.

The frontend API base URL currently defaults to:

```text
http://127.0.0.1:8011/api/v1
```

To use a different backend URL, create `frontend/.env.local`:

```text
VITE_API_BASE_URL=http://127.0.0.1:8011/api/v1
```

Do not commit real credentials or private environment files.

## Run the backend

The following is the intended local launch command for the current development setup. A clean-clone setup still requires the TIGAS backend source and compatible checkpoint to be committed or otherwise made available.

From the repository root:

```powershell
.\.venv\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8011
```

If you create a fresh environment, install the dependencies from the verified project requirements after confirming the final dependency file. Do not assume the currently tracked backend requirements include every dependency needed by the untracked TIGAS model code.

When the server is running and API documentation is enabled, open:

```text
http://127.0.0.1:8011/docs
```

## Reproducibility and responsible reporting

For a reproducible release, publish or document all of the following:

- Dataset name, source URL, licence, version, and permitted use.
- Exact train/validation/test split procedure and class counts.
- Image preprocessing and augmentation configuration.
- Model architecture and training configuration.
- Checkpoint identifier or SHA-256 checksum.
- Evaluation script, threshold-selection procedure, and complete test metrics.
- Duplicate/near-duplicate audit outcome and any exclusions.

Do not upload private, restricted, or unlicensed image data. Large datasets and model checkpoints should be distributed only through an appropriate, documented hosting method; do not commit them blindly to Git.

## Current limitations

- Binary classification does not explain why an image was classified as REAL or FAKE.
- Scores are model outputs and are not necessarily calibrated probabilities.
- Performance may change across image sources, compression, editing methods, and unseen domains.
- Near-duplicate audit work remains a limitation of the currently recorded evaluation.
- A local API URL is not a public deployment. Public access requires a separately hosted backend and model artifact.

## Project focus

TIGAS is the standalone focus of this repository: a CNN-based image authenticity classification research project with a web interface for interactive inference.
