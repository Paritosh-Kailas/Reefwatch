# Reefwatch

Reefwatch is a React + Express application for exploring marine microplastics observations. Its primary working feature is a global Leaflet map backed by the NOAA National Centers for Environmental Information (NCEI) Marine Microplastics dataset bundled in this repository.

> **Data integrity:** The CSV contains archived field observations. It is not a live sensor network. Measurements from different marine settings, sampling methods and units are not directly interchangeable.

## Current status

**Working:** React dashboard, OpenStreetMap basemap, CSV-backed global microplastics map, marker details, reef-belt and minimum-class filters, labelled demo fallback, Express map/statistics/reload endpoints, Vercel SPA routing, Render blueprint.

**Incomplete/prototype:** AI image analysis, coral health, species catalogue UI, density analytics, reports and some authentication UI. Several of these backend modules still return mock data or require database/model configuration. Do not present them as verified production features.

## How the global map works

1. The Express process starts in server/server.js and mounts server/routes/pollutionroutes.js at /api/pollution.
2. GET /api/pollution/map calls getPollutionMap in server/controllers/pollutioncontroller.js.
3. The controller reads server/uploads/microplastics.csv with csv-parse. It validates coordinates and retains each row with valid latitude/longitude plus either a numeric microplastics measurement or a source concentration class.
4. Records are grouped by country/site, rounded coordinates, marine setting, sampling method and unit. Different units (for example pieces per cubic metre and pieces per kilogram) are never averaged together.
5. A marker represents a grouped site/context. Its popup shows source-record count, numeric-measurement count, mean measurement when available, common source concentration class, dates, method, setting and references.
6. The frontend requests the API through client/src/api/pollutionApi.js and renders the map in client/src/components/dashboard/MarineMapView.jsx.
7. If the backend cannot be reached, the map shows a small set of clearly labelled illustrative demo markers instead of pretending those are observations.

### Important score warning

The map converts source concentration classes to a 0–100 display score (Very Low 15, Low 35, Medium 60, High 80, Very High 95; unclassified 50). This is only a colour/slider encoding. It is not a validated pollution-risk score and must not be used for scientific ranking. Inspect the original measurement, unit, setting, method and source citation.

### Dataset source

- NOAA NCEI Marine Microplastics Database: https://www.ncei.noaa.gov/products/microplastics
- NOAA NCEI map help: https://www.ncei.noaa.gov/products/microplastics/help
- Database paper: https://doi.org/10.1038/s41597-023-02632-y

The CSV is a repository snapshot. Updating it requires obtaining a newer dataset, checking its schema/provenance, replacing the file and redeploying the backend.

## File-by-file guide

### Root
| File | Function |
|---|---|
| .gitignore | Excludes local dependencies, secrets, build output and generated files from Git. |
| README.md | Main project, setup, API, limitations and file reference. |
| PROJECT_GUIDE.md | Extended CSV, API, deployment and data-caveat notes. |
| render.yaml | Render Blueprint for deploying the Express API. |

### Frontend — client/
| File or folder | Function |
|---|---|
| package.json / package-lock.json | Frontend scripts, libraries and locked dependency versions. |
| index.html | Vite HTML shell and React mount element. |
| .env.example | Example VITE_API_BASE_URL setting. |
| .gitignore | Frontend-specific ignored files. |
| README.md | Vite starter documentation; use this root README for Reefwatch-specific instructions. |
| vite.config.js | Active Vite build/dev config and React plugin. |
| vite.config.ts | Unused TypeScript starter config. |
| tailwind.config.js | Tailwind content paths and theme configuration. |
| postcss.config.js | Tailwind and Autoprefixer processing. |
| eslint.config.js | Frontend lint rules. |
| tsconfig.json, tsconfig.app.json, tsconfig.node.json | TypeScript starter configuration; current app is JavaScript. |
| vercel.json | Rewrites deep links such as /dashboard to index.html for React Router. |
| public/favicon.svg | Browser tab icon. |
| public/icons.svg | SVG icon sprite. |
| public/favicon.ico, public/logo.svg | 2-byte placeholders; not valid finished assets. |
| public/sample-corals/*.jpg | Empty image placeholders; not valid JPEG images. |
| src/main.jsx | Active entry point; mounts React and imports global CSS. |
| src/App.jsx | Root component that renders AppRoutes. |
| src/main.tsx, src/App.tsx | Unused TypeScript starter files; active files are main.jsx and App.jsx. |
| src/App.css, src/index.css | Starter stylesheets not imported by the active entry. |
| src/styles/globals.css | Active global stylesheet. |
| src/styles/tailwind.css | Tailwind directives and utilities stylesheet. |
| src/routes/AppRoutes.jsx | Maps URL paths to home, dashboard, login, register and not-found pages. |
| src/pages/HomePage.jsx | Landing page and navigation to the global map. |
| src/pages/DashboardPage.jsx | Dashboard shell that hosts MarineMapView. |
| src/pages/LoginPage.jsx, RegisterPage.jsx | Current login/register shells; forms are not wired yet. |
| src/pages/NotFoundPage.jsx | Unknown-route fallback. |
| src/pages/AnalysisDetailsPage.jsx | Empty future analysis-detail page. |
| src/pages/ProfilePage.jsx | Empty future user profile page. |
| src/pages/ReportsPage.jsx | Empty future reports page. |
| src/pages/ScannerPage.jsx | Empty future image-scanner page. |
| src/pages/SpeciesCatalogPage.jsx | Empty future species catalogue page. |
| src/components/common/Navbar.jsx | Main navigation. |
| src/components/common/AlertBanner.jsx, Footer.jsx, LoadingSpinner.jsx, Modal.jsx, ProtectedRoute.jsx, Sidebar.jsx | Empty reusable UI placeholders; not implemented. |
| src/components/auth/LoginForm.jsx, RegisterForm.jsx, ResetPasswordForm.jsx | Empty authentication form placeholders. |
| src/components/dashboard/MarineMapView.jsx | Main Leaflet map: API loading, markers, popups, filters, summary counts and demo fallback. |
| src/components/dashboard/RecentScansList.jsx, StatsOverview.jsx | Empty dashboard component placeholders. |
| src/components/coral/BleachingGauge.jsx, CoralHealthCard.jsx, CoralTypeBadge.jsx | Empty coral UI placeholders. |
| src/components/density/CoverageChart.jsx, DensityHeatmap.jsx | Empty density visualization placeholders. |
| src/components/pollution/DebrisBreakdownChart.jsx, PollutionSeverityCard.jsx, WaterClarityMeter.jsx | Empty pollution UI placeholders. |
| src/components/reports/ExportButton.jsx, ReportGeneratorForm.jsx, ReportPreviewModal.jsx, ReportTable.jsx | Empty report UI placeholders. |
| src/components/scanner/BoundingBoxCanvas.jsx, CameraCapture.jsx, ImageUploader.jsx, ScanProgressTracker.jsx | Empty scanner UI placeholders. |
| src/components/species/SpeciesCard.jsx, SpeciesDetailModal.jsx, SpeciesGrid.jsx, SpeciesSearchFilter.jsx | Empty species UI placeholders. |
| src/api/axiosInstance.js | Shared Axios client, API base URL, credentials and JWT header. |
| src/api/authApi.js | Login, registration and current-user request wrappers. |
| src/api/userApi.js | User endpoint request wrappers. |
| src/api/coralApi.js | Coral endpoint request wrappers. |
| src/api/densityApi.js | Density endpoint request wrappers. |
| src/api/pollutionApi.js | Pollution map and statistics request wrappers. |
| src/api/reportApi.js | Report endpoint request wrappers. |
| src/api/speciesApi.js | Species endpoint request wrappers. |
| src/context/AuthContext.jsx, ScanContext.jsx | Empty future shared-state providers. |
| src/hooks/useAuth.js, useCoralAnalysis.js, useImageScanner.js, useReports.js, useSpeciesCatalog.js | Empty future reusable React hooks. |
| src/utils/canvasHelpers.js | Empty canvas/image-coordinate helper placeholder. |
| src/utils/constants.js | Empty shared-constants placeholder. |
| src/utils/exportHelpers.js | Empty report/file-export helper placeholder. |
| src/utils/formatters.js | Empty date/number formatting helper placeholder. |
| src/assets/hero.png | Landing-page image asset. |
| src/assets/react.svg, vite.svg | Unused starter graphics. |
| src/assets/icons/.gitkeep, src/assets/images/.gitkeep | Keep otherwise empty asset directories in Git. |

### Backend — server/
| File or folder | Function |
|---|---|
| package.json / package-lock.json | Backend scripts, dependencies and locked versions. |
| .env.example | Template for backend environment variables; never commit real secrets. |
| .gitignore | Excludes backend secrets, dependencies and generated files. |
| server.js | Express entry point: CORS, JSON parsing, optional MongoDB, route mounting, health check and error handling. |
| config/db.js | Mongoose/MongoDB connection setup. |
| config/cloudinary.js | Cloudinary image-storage configuration. |
| config/hfconfig.js | Hugging Face inference client configuration; optional and requires package/token setup. |
| routes/authroutes.js | Registration, login and current-user routes. |
| routes/userroutes.js | User profile routes. |
| routes/densityroutes.js | Reef-density map and statistics routes. |
| routes/pollutionroutes.js | Pollution map, statistics and CSV-cache reload routes. |
| routes/coralroutes.js | Coral-analysis routes. |
| routes/speciesroutes.js | Species catalogue CRUD routes. |
| routes/reportroutes.js | Authenticated report routes. |
| controllers/authcontroller.js | User registration, password verification and JWT responses. |
| controllers/usercontroller.js | User profile request handlers. |
| controllers/densitycontroller.js | Hard-coded illustrative reef-density data; not verified observations. |
| controllers/pollutioncontroller.js | CSV parsing, coordinate validation, grouping, aggregation and map/statistics responses. |
| controllers/coralcontrollers.js | CRUD handlers for saved coral-analysis records. |
| controllers/speciescontroller.js | Species catalogue database handlers. |
| controllers/reportcontroller.js | Report database handlers. |
| controllers/detectioncontroller.js | Species-detection record handlers; currently not mounted in server.js. |
| models/user.js | Mongoose user schema and password comparison method. |
| models/densityanalysis.js | Reef-density record schema. |
| models/pollutionanalysis.js | Pollution-analysis record schema. |
| models/coralanalysis.js | Coral-analysis record schema. |
| models/species.js | Species catalogue schema. |
| models/speciesdetection.js | Species-detection schema. |
| models/report.js | Saved-report schema. |
| middleware/authmiddleware.js | JWT verification and role authorization. |
| middleware/errormiddleware.js | Standard API error responses. |
| middleware/uploadmiddleware.js | Multer file-upload configuration. |
| middleware/validationmiddleware.js | Express-validator result handling. |
| services/coralAnalysisService.js | Coral-analysis service stub. |
| services/densityAnalysisService.js | Density-analysis service stub. |
| services/huggingFaceService.js | Image classification helper for Hugging Face inference. |
| services/pollutionAnalysisService.js | Currently creates mock image-analysis results; not used by the CSV map. |
| services/reportService.js | Report service stub. |
| services/speciesDetectionService.js | Species-detection service stub. |
| utils/apierror.js | Custom HTTP/API error class. |
| utils/generatetoken.js | JWT signing helper. |
| utils/imageprocessor.js | Image-processing helper. |
| utils/samplehotspots.js | Legacy illustrative hotspots; not used by the CSV-backed map. |
| validators/authvalidator.js | Authentication input validation rules. |
| validators/coralvalidator.js | Coral input validation rules. |
| validators/pollutionvalidator.js | Pollution input validation rules. |
| validators/speciesvalidator.js | Species input validation rules. |
| uploads/microplastics.csv | Bundled NOAA NCEI archived microplastics observations used by the map. |

## API reference

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/health | API health and whether MongoDB is configured. |
| GET | /api/pollution/map | All valid geolocated CSV observations grouped into map sites. |
| GET | /api/pollution/stats | Record count, measured-record count, site count, concentration classes and units. |
| POST | /api/pollution/import | Clears cache and reloads the bundled CSV; does not upload a new file. |
| GET | /api/density/map | Illustrative reef-density values (mock). |
| GET | /api/density/stats | Summary of illustrative reef-density values (mock). |
| /api/auth/* | Auth routes | Registration, login and current-user operations. |
| /api/species/* | Species routes | Species CRUD; MongoDB required. |
| /api/coral/* | Coral routes | Coral-analysis record operations; MongoDB required. |
| /api/reports/* | Report routes | Protected report operations; MongoDB and JWT required. |
| /api/users/* | User routes | User operations; MongoDB and JWT required. |

## Run locally

Use a current Node.js LTS release and npm. MongoDB is optional for the CSV map but required for persisted accounts, reports and analysis records.

Backend terminal:

```bash
cd server
npm install
cp .env.example .env
# MONGO_URI may be left unset if you only want to run the CSV map.
npm run dev
```

Frontend terminal:

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Open the Vite URL printed in the terminal (usually http://localhost:5173). Test the API at http://localhost:5000/api/health and http://localhost:5000/api/pollution/map.

## Deployment

### Render backend

Create a new Render Blueprint from this repository and deploy the reefwatch-api service described by render.yaml. Then test:

- https://YOUR-API-HOST/api/health
- https://YOUR-API-HOST/api/pollution/map

The map response should include isLive: false, the NOAA source label, totalReadings and hotspots.

### Vercel frontend

Set VITE_API_BASE_URL to https://YOUR-API-HOST/api in Vercel project environment variables for Preview and Production, then redeploy. Set backend CLIENT_URL to the production Vercel origin. The API also permits Reefwatch Vercel preview origins.

### Environment variables

Frontend: VITE_API_BASE_URL (backend API root, including /api).

Backend: PORT, NODE_ENV, CLIENT_URL, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, HF_API_TOKEN and HF_MODEL_URL. MongoDB, Cloudinary and Hugging Face settings are only needed for their corresponding features.

## Known gaps before production use

- Several frontend components, hooks and pages listed above are empty placeholders.
- Login/register frontend forms are not wired even though backend auth routes exist.
- Reef-density data is hard-coded; some coral/pollution analysis services return mock values.
- AI inference needs a verified model, configured credentials, installed dependencies and evaluation.
- Sample coral JPEGs and the legacy logo/favicon files are invalid placeholders.
- Add automated tests for CSV parsing, missing measurements, coordinate bounds, aggregation by unit/method, API responses and map rendering.
