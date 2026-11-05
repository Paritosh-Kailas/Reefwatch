# Reefwatch

Reefwatch is a React + Express application for exploring marine microplastics observations and prototype reef-density summaries. The main data feature is a Leaflet global map backed by the NOAA National Centers for Environmental Information (NCEI) marine microplastics CSV stored in this repository.

> **Data integrity:** The microplastics CSV is an archived dataset snapshot, not a live sensor feed. Different marine settings, collection methods and measurement units are not directly comparable. The density report currently uses illustrative backend examples, not verified reef-survey measurements.

## 1. Features and routes

| Browser route | Feature | Data status |
|---|---|---|
| `/` | Reefwatch home page with feature cards | Navigation/overview |
| `/dashboard` | Global microplastics map; inspect observation markers, filters and source details | Archived NOAA CSV observations when API is connected; labelled demo fallback if unavailable |
| `/reports/density` | Reef density summary, searchable/filterable table and CSV export | Illustrative sample data from the current density controller |
| `/login`, `/register` | Authentication page shells | Backend endpoints exist; frontend forms are not fully wired |

### Global pollution map data flow

1. `server/server.js` creates the Express API and mounts the pollution router at `/api/pollution`.
2. `server/routes/pollutionroutes.js` maps map/statistics/reload requests to the pollution controller.
3. `server/controllers/pollutioncontroller.js` parses `server/uploads/microplastics.csv`, validates geographic coordinates, and aggregates observations into map locations.
4. Aggregation keeps country/site, rounded coordinates, marine setting, sampling method and measurement unit in the grouping key. It does not average unlike units together.
5. The API returns marker metadata such as source-record count, numeric measurement count, mean measurement where available, concentration class, date range, method, setting and source references.
6. `client/src/api/pollutionApi.js` calls the API and `client/src/components/dashboard/MarineMapView.jsx` renders the Leaflet map, markers, filters and source details.
7. If the API is unavailable, the map shows clearly labelled illustrative demo markers. Demo values must not be described as measured pollution observations.

**Map score warning:** concentration classes are mapped to a 0–100 visual score for marker styling/filtering. This is not a validated pollution-risk score and must not be used for scientific ranking. Read the original measurement, unit, sampling context and source citation.

### Density report data flow

1. `client/src/pages/ReportsPage.jsx` requests the density map and statistics.
2. `client/src/api/densityApi.js` sends requests to the density API.
3. `server/routes/densityroutes.js` routes requests to `server/controllers/densitycontroller.js`.
4. The controller currently returns hard-coded illustrative reef records and summary statistics.
5. The page displays summary cards, search and density-class filters, a table, and a CSV export of the filtered rows.

The report interface is implemented, but its current values are not a verified global reef-density dataset. Connect a cited reef survey source before using the numbers as scientific findings.

## 2. Data files and assets

These are the repository's committed data/content files. There is currently **one structured observation dataset CSV**.

| Path | Type | What it contains / how code uses it |
|---|---|---|
| `server/uploads/microplastics.csv` | CSV, ~619 KB | Bundled NOAA NCEI marine microplastics observation snapshot. The pollution controller reads it to produce map markers and statistics. It includes observation identifiers, sample dates, latitude/longitude, measured concentration, unit, concentration class, ocean/region/country/site, marine setting or sampling context, method and source/reference fields where supplied. It is archived source data, not live data. |
| `client/src/assets/hero.png` | PNG image | Hero/landing-page visual imported by frontend code where referenced. |
| `client/public/favicon.svg` | SVG image | Browser tab icon served directly from the public folder. |
| `client/public/icons.svg` | SVG sprite | Collection of reusable SVG symbols/icons. |
| `client/public/favicon.ico` | Placeholder (2 bytes) | Not a valid finished ICO image; use the SVG favicon instead or replace this asset. |
| `client/public/logo.svg` | Placeholder (2 bytes) | Empty placeholder, not a usable logo. |
| `client/public/sample-corals/bleached-coral.jpg` | Placeholder (2 bytes) | Empty placeholder, not a valid coral photograph. |
| `client/public/sample-corals/brain-coral.jpg` | Placeholder (2 bytes) | Empty placeholder, not a valid coral photograph. |
| `client/public/sample-corals/staghorn-coral.jpg` | Placeholder (2 bytes) | Empty placeholder, not a valid coral photograph. |
| `client/src/assets/react.svg` | SVG image | Unused Vite/React starter graphic. |
| `client/src/assets/vite.svg` | SVG image | Unused Vite starter graphic. |
| `client/src/assets/icons/.gitkeep` | Git placeholder | Keeps the otherwise empty icons asset folder in Git. |
| `client/src/assets/images/.gitkeep` | Git placeholder | Keeps the otherwise empty images asset folder in Git. |

No additional CSV, JSON, GeoJSON or spreadsheet data files are currently tracked in the repository tree. The density report does not read a density CSV yet; it gets illustrative values from the density controller. The image files under `sample-corals` are placeholders and must be replaced before image-analysis features use them.

### CSV handling and updating the dataset

- Keep the source file at `server/uploads/microplastics.csv` unless you also update the path in the pollution controller.
- Preserve the source header names and provenance columns when replacing the file. Check the new download's licence, citation, date coverage and schema before committing it.
- Do not combine concentrations with different units or sampling methods into a single average.
- The backend caches parsed CSV data in memory. Restart/redeploy the backend after replacing the CSV, or call the supported cache reload endpoint if appropriate.
- The current dataset snapshot is from NOAA NCEI. See [NOAA NCEI Marine Microplastics](https://www.ncei.noaa.gov/products/microplastics), [NOAA map help](https://www.ncei.noaa.gov/products/microplastics/help), and the [database paper](https://doi.org/10.1038/s41597-023-02632-y).

## 3. File-by-file code reference

The tables below list the tracked project files and briefly describe the purpose of their code/configuration. A file marked **placeholder** is present in Git but currently has no implemented feature code.

### Repository root and automation

| File | Explanation |
|---|---|
| `.gitignore` | Root Git ignore rules for local secrets, dependencies, build outputs and generated files. |
| `.github/workflows/ci.yml` | GitHub Actions workflow for automated repository checks on configured pushes/pull requests. |
| `README.md` | This project overview, setup guide, data inventory and file-by-file code reference. |
| `PROJECT_GUIDE.md` | Extended technical guide focused on the CSV, API behavior, deployment and data limitations. |
| `render.yaml` | Render Blueprint declaring how to build, start and health-check the Express backend service. |

### Frontend configuration — `client/`

| File | Explanation |
|---|---|
| `client/package.json` | Frontend package metadata, npm scripts and direct dependencies. |
| `client/package-lock.json` | Exact dependency tree versions for repeatable npm installs; generated by npm. |
| `client/.env.example` | Example frontend environment setting, including the API base URL key. Copy to a local `.env` and set values for local development. |
| `client/.gitignore` | Ignores frontend-local dependencies, build output and environment files. |
| `client/README.md` | Vite starter documentation; this root README is the Reefwatch-specific guide. |
| `client/index.html` | Vite HTML document, page metadata and React mount element. |
| `client/vite.config.js` | Active Vite configuration and React plugin setup. |
| `client/vite.config.ts` | TypeScript starter Vite configuration; the active app build uses `vite.config.js`. |
| `client/tailwind.config.js` | Tailwind CSS content scanning and theme configuration. |
| `client/postcss.config.js` | Configures PostCSS plugins used to process Tailwind CSS and browser prefixes. |
| `client/eslint.config.js` | ESLint rules and file patterns for frontend code quality checks. |
| `client/tsconfig.json` | TypeScript project references for the starter TypeScript setup. |
| `client/tsconfig.app.json` | TypeScript compiler options for app-side starter files. |
| `client/tsconfig.node.json` | TypeScript compiler options for Node/Vite configuration files. |
| `client/vercel.json` | Vercel rewrite that sends client-side routes such as `/dashboard` to the SPA entry document. |

### Frontend entry, routing, pages and styles — `client/src/`

| File | Explanation |
|---|---|
| `client/src/main.jsx` | Active React entry point; imports global styles and mounts the application. |
| `client/src/App.jsx` | Root React component; renders the route configuration. |
| `client/src/routes/AppRoutes.jsx` | Declares browser routes and associates each path with its page component. |
| `client/src/pages/HomePage.jsx` | Landing page and feature cards linking to the global map and density report. |
| `client/src/pages/DashboardPage.jsx` | Dashboard page shell that displays the marine map component. |
| `client/src/pages/ReportsPage.jsx` | Density report UI: fetches density data, shows statistics/table, filters records and exports filtered rows as CSV. |
| `client/src/pages/LoginPage.jsx` | Login page shell; the complete authentication form flow is not yet wired. |
| `client/src/pages/RegisterPage.jsx` | Registration page shell; the complete authentication form flow is not yet wired. |
| `client/src/pages/NotFoundPage.jsx` | Fallback page for unknown browser routes. |
| `client/src/pages/AnalysisDetailsPage.jsx` | **Placeholder:** reserved for a future analysis-detail view. |
| `client/src/pages/ProfilePage.jsx` | **Placeholder:** reserved for a user profile page. |
| `client/src/pages/ScannerPage.jsx` | **Placeholder:** reserved for an image-scanning workflow. |
| `client/src/pages/SpeciesCatalogPage.jsx` | **Placeholder:** reserved for a species catalogue page. |
| `client/src/main.tsx` | Unused TypeScript starter entry; active entry is `main.jsx`. |
| `client/src/App.tsx` | Unused TypeScript starter root component; active root is `App.jsx`. |
| `client/src/App.css` | Starter/component stylesheet not imported by the active JSX entry flow. |
| `client/src/index.css` | Legacy/starter stylesheet; active global styles are in `styles/globals.css` and `styles/tailwind.css`. |
| `client/src/styles/globals.css` | Active global base styles for the application. |
| `client/src/styles/tailwind.css` | Tailwind CSS directives/utilities entry imported by the active style setup. |

### Frontend API clients — `client/src/api/`

| File | Explanation |
|---|---|
| `client/src/api/axiosInstance.js` | Shared Axios instance; centralizes API base URL, credentials and authorization-header behavior. |
| `client/src/api/pollutionApi.js` | HTTP helpers for pollution map and pollution statistics endpoints. |
| `client/src/api/densityApi.js` | HTTP helpers for density map and density statistics endpoints. |
| `client/src/api/authApi.js` | HTTP helpers for registration, login and current-user authentication endpoints. |
| `client/src/api/userApi.js` | HTTP helpers for user/profile endpoints. |
| `client/src/api/coralApi.js` | HTTP helpers for coral-analysis endpoints. |
| `client/src/api/reportApi.js` | HTTP helpers for saved-report endpoints. |
| `client/src/api/speciesApi.js` | HTTP helpers for species catalogue/detection endpoints. |

### Frontend components — `client/src/components/`

| File | Explanation |
|---|---|
| `client/src/components/common/Navbar.jsx` | Shared top navigation with links to Home, Global pollution map, Density report and sign-in. |
| `client/src/components/dashboard/MarineMapView.jsx` | Main Leaflet map; fetches pollution observations, renders markers/popups, filters, summary metrics, source details and labelled fallback demo markers. |
| `client/src/components/common/AlertBanner.jsx` | **Placeholder:** intended reusable alert/banner component. |
| `client/src/components/common/Footer.jsx` | **Placeholder:** intended shared footer. |
| `client/src/components/common/LoadingSpinner.jsx` | **Placeholder:** intended loading indicator. |
| `client/src/components/common/Modal.jsx` | **Placeholder:** intended reusable modal dialog. |
| `client/src/components/common/ProtectedRoute.jsx` | **Placeholder:** intended authentication-gated route wrapper. |
| `client/src/components/common/Sidebar.jsx` | **Placeholder:** intended sidebar navigation. |
| `client/src/components/auth/LoginForm.jsx` | **Placeholder:** intended login form component. |
| `client/src/components/auth/RegisterForm.jsx` | **Placeholder:** intended registration form component. |
| `client/src/components/auth/ResetPasswordForm.jsx` | **Placeholder:** intended password-reset form component. |
| `client/src/components/dashboard/RecentScansList.jsx` | **Placeholder:** intended list of recent scan results. |
| `client/src/components/dashboard/StatsOverview.jsx` | **Placeholder:** intended dashboard metric cards. |
| `client/src/components/coral/BleachingGauge.jsx` | **Placeholder:** intended coral bleaching indicator. |
| `client/src/components/coral/CoralHealthCard.jsx` | **Placeholder:** intended coral-health summary card. |
| `client/src/components/coral/CoralTypeBadge.jsx` | **Placeholder:** intended coral type label. |
| `client/src/components/density/CoverageChart.jsx` | **Placeholder:** intended reef coverage chart. |
| `client/src/components/density/DensityHeatmap.jsx` | **Placeholder:** intended density heatmap. |
| `client/src/components/pollution/DebrisBreakdownChart.jsx` | **Placeholder:** intended debris-category chart. |
| `client/src/components/pollution/PollutionSeverityCard.jsx` | **Placeholder:** intended pollution severity summary. |
| `client/src/components/pollution/WaterClarityMeter.jsx` | **Placeholder:** intended water clarity display. |
| `client/src/components/reports/ExportButton.jsx` | **Placeholder:** intended reusable report export control; current density CSV export is implemented inside `ReportsPage.jsx`. |
| `client/src/components/reports/ReportGeneratorForm.jsx` | **Placeholder:** intended report-generation form. |
| `client/src/components/reports/ReportPreviewModal.jsx` | **Placeholder:** intended report preview dialog. |
| `client/src/components/reports/ReportTable.jsx` | **Placeholder:** intended reusable report table. |
| `client/src/components/scanner/BoundingBoxCanvas.jsx` | **Placeholder:** intended canvas for image-detection boxes. |
| `client/src/components/scanner/CameraCapture.jsx` | **Placeholder:** intended camera capture component. |
| `client/src/components/scanner/ImageUploader.jsx` | **Placeholder:** intended image upload component. |
| `client/src/components/scanner/ScanProgressTracker.jsx` | **Placeholder:** intended scan progress display. |
| `client/src/components/species/SpeciesCard.jsx` | **Placeholder:** intended species summary card. |
| `client/src/components/species/SpeciesDetailModal.jsx` | **Placeholder:** intended species details dialog. |
| `client/src/components/species/SpeciesGrid.jsx` | **Placeholder:** intended species card grid. |
| `client/src/components/species/SpeciesSearchFilter.jsx` | **Placeholder:** intended species search and filter controls. |

### Frontend state, hooks, utilities and assets

| File | Explanation |
|---|---|
| `client/src/context/AuthContext.jsx` | **Placeholder:** intended shared authentication state/context. |
| `client/src/context/ScanContext.jsx` | **Placeholder:** intended shared image-scan state/context. |
| `client/src/hooks/useAuth.js` | **Placeholder:** intended reusable authentication hook. |
| `client/src/hooks/useCoralAnalysis.js` | **Placeholder:** intended reusable coral-analysis hook. |
| `client/src/hooks/useImageScanner.js` | **Placeholder:** intended reusable scanner hook. |
| `client/src/hooks/useReports.js` | **Placeholder:** intended reusable report hook. |
| `client/src/hooks/useSpeciesCatalog.js` | **Placeholder:** intended reusable species catalogue hook. |
| `client/src/utils/canvasHelpers.js` | **Placeholder:** intended canvas/image-coordinate helpers. |
| `client/src/utils/constants.js` | **Placeholder:** intended shared frontend constants. |
| `client/src/utils/exportHelpers.js` | **Placeholder:** intended shared file/report export helpers. |
| `client/src/utils/formatters.js` | **Placeholder:** intended shared date/number/text formatters. |
| `client/src/assets/hero.png` | Landing-page image asset. |
| `client/src/assets/react.svg` | Unused React starter graphic. |
| `client/src/assets/vite.svg` | Unused Vite starter graphic. |
| `client/src/assets/icons/.gitkeep` | Keeps the icons asset directory tracked while it is empty. |
| `client/src/assets/images/.gitkeep` | Keeps the images asset directory tracked while it is empty. |

### Backend configuration and entry point — `server/`

| File | Explanation |
|---|---|
| `server/package.json` | Backend package metadata, npm scripts and Express/Mongoose/CSV dependencies. |
| `server/package-lock.json` | Exact backend dependency tree generated by npm. |
| `server/.env.example` | Template for backend environment variables; do not put real secrets in Git. |
| `server/.gitignore` | Ignores backend environment secrets, dependencies and generated files. |
| `server/server.js` | Express entry point; configures middleware/CORS, optional MongoDB startup, API route mounting, health endpoint and error handling. |
| `server/config/db.js` | Opens the MongoDB/Mongoose connection when a MongoDB URI is configured. |
| `server/config/cloudinary.js` | Configures Cloudinary for optional image storage. |
| `server/config/hfconfig.js` | Configures Hugging Face inference access; requires the relevant package, model and token to be set up. |

### Backend routes — `server/routes/`

| File | Explanation |
|---|---|
| `server/routes/pollutionroutes.js` | Defines pollution map, statistics and CSV-cache reload endpoints. |
| `server/routes/densityroutes.js` | Defines density map and density statistics endpoints. |
| `server/routes/authroutes.js` | Defines registration, login and current-user authentication endpoints. |
| `server/routes/userroutes.js` | Defines user/profile endpoints. |
| `server/routes/coralroutes.js` | Defines coral-analysis record endpoints. |
| `server/routes/speciesroutes.js` | Defines species catalogue endpoints. |
| `server/routes/reportroutes.js` | Defines saved-report endpoints and their protection middleware. |

### Backend controllers — `server/controllers/`

| File | Explanation |
|---|---|
| `server/controllers/pollutioncontroller.js` | Reads/parses the NOAA CSV, validates observations, groups compatible records, calculates summaries and serves pollution map/statistics responses. |
| `server/controllers/densitycontroller.js` | Returns hard-coded illustrative reef-density records and summary statistics; not a verified survey feed. |
| `server/controllers/authcontroller.js` | Handles user registration/login, password checks and authentication responses. |
| `server/controllers/usercontroller.js` | Handles user/profile API operations. |
| `server/controllers/coralcontrollers.js` | Handles saved coral-analysis record operations. |
| `server/controllers/speciescontroller.js` | Handles species catalogue data operations. |
| `server/controllers/reportcontroller.js` | Handles saved research/report operations. |
| `server/controllers/detectioncontroller.js` | Handles species-detection record operations; check route mounting before assuming it is exposed by the API. |

### Backend models, middleware, services, utilities and validators

| File | Explanation |
|---|---|
| `server/models/user.js` | Mongoose user schema and password-related model behavior. |
| `server/models/densityanalysis.js` | Mongoose schema for saved reef-density analysis records. |
| `server/models/pollutionanalysis.js` | Mongoose schema for saved pollution-analysis records. |
| `server/models/coralanalysis.js` | Mongoose schema for saved coral-analysis records. |
| `server/models/species.js` | Mongoose schema for species catalogue entries. |
| `server/models/speciesdetection.js` | Mongoose schema for species-detection records. |
| `server/models/report.js` | Mongoose schema for saved reports. |
| `server/middleware/authmiddleware.js` | Verifies JWTs and applies authentication/role checks to protected routes. |
| `server/middleware/errormiddleware.js` | Converts thrown/request errors into consistent API error responses. |
| `server/middleware/uploadmiddleware.js` | Configures Multer file-upload handling. |
| `server/middleware/validationmiddleware.js` | Checks Express Validator results and rejects invalid request input. |
| `server/services/coralAnalysisService.js` | Coral-analysis service layer/stub; requires a real analysis implementation for production use. |
| `server/services/densityAnalysisService.js` | Density-analysis service layer/stub; current map controller uses illustrative records. |
| `server/services/huggingFaceService.js` | Helper for calling Hugging Face inference for image/model tasks. |
| `server/services/pollutionAnalysisService.js` | Pollution image-analysis service stub/mock; separate from the CSV-backed map controller. |
| `server/services/reportService.js` | Report service layer/stub for report generation and persistence. |
| `server/services/speciesDetectionService.js` | Species-detection service layer/stub for model-based identification. |
| `server/utils/apierror.js` | Custom API error class carrying HTTP status information. |
| `server/utils/generatetoken.js` | Creates signed JWT authentication tokens. |
| `server/utils/imageprocessor.js` | Image-processing helper used by image-analysis workflows. |
| `server/utils/samplehotspots.js` | Legacy illustrative hotspot dataset; the CSV-backed pollution controller is the current map data source. |
| `server/validators/authvalidator.js` | Request validation rules for authentication inputs. |
| `server/validators/coralvalidator.js` | Request validation rules for coral-analysis inputs. |
| `server/validators/pollutionvalidator.js` | Request validation rules for pollution inputs. |
| `server/validators/speciesvalidator.js` | Request validation rules for species inputs. |

## 4. API reference

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Backend health and MongoDB configuration status. |
| GET | `/api/pollution/map` | Geolocated observations aggregated from the CSV. |
| GET | `/api/pollution/stats` | Pollution record/site/measurement summaries. |
| POST | `/api/pollution/import` | Clears the in-memory CSV cache so it is re-read; it does not upload a new CSV file. |
| GET | `/api/density/map` | Illustrative reef-density records. |
| GET | `/api/density/stats` | Summary of illustrative reef-density records. |
| / | `/api/auth/*` | Authentication routes. |
| / | `/api/users/*` | User routes; database-backed. |
| / | `/api/coral/*` | Coral routes; database-backed. |
| / | `/api/species/*` | Species routes; database-backed. |
| / | `/api/reports/*` | Report routes; database-backed and protected as configured. |

## 5. Run locally

Use a current Node.js LTS release and npm. Start the backend and frontend in separate terminals.

**Backend**

```bash
cd server
npm install
cp .env.example .env
# MONGO_URI can remain unset when testing only the CSV map.
npm run dev
```

**Frontend**

```bash
cd client
npm install
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000/api
npm run dev
```

Open the Vite development URL shown in the terminal (usually `http://localhost:5173`). The API is usually available at `http://localhost:5000/api/health` and `http://localhost:5000/api/pollution/map`.

## 6. Deployment

### Render backend

Deploy the repository using the Blueprint in `render.yaml`. After deployment, test:

- `https://YOUR-RENDER-SERVICE.onrender.com/api/health`
- `https://YOUR-RENDER-SERVICE.onrender.com/api/pollution/map`

### Vercel frontend

Set `VITE_API_BASE_URL` to the backend API root, including `/api` (for example, `https://YOUR-RENDER-SERVICE.onrender.com/api`) in Vercel Preview and Production environments. Redeploy after changing the variable because Vite embeds it at build time.

### Environment variables

- Frontend: `VITE_API_BASE_URL`.
- Backend: `PORT`, `NODE_ENV`, `CLIENT_URL`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, Cloudinary credentials and Hugging Face settings as required by the enabled modules.

Never commit real API keys, passwords, database URLs or tokens. MongoDB is not required for the CSV map endpoints; database-backed user/report/analysis features need a valid `MONGO_URI`.

## 7. Known limitations and next work

- The density report is implemented as a UI, but its current source records are illustrative hard-coded values.
- AI coral analysis, image scanning, species catalogue and several report/auth UI components are placeholders or require external model/database configuration.
- Several component, hook, context and utility files listed above are currently empty placeholders.
- The sample coral JPEGs and public logo/ICO files listed above are 2-byte placeholders, not valid image assets.
- The CSV map uses archived NOAA observations and is not a real-time pollution monitor.
- Add automated tests for CSV parsing, coordinate validation, grouping by unit/method/context, API response shape, report filtering/export and frontend route behavior.

Check `PROJECT_GUIDE.md` for additional implementation notes and deployment troubleshooting.
