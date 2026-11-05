# Reefwatch project and data guide

## Current data status

The dashboard map reads `server/uploads/microplastics.csv`. This is a bundled, archived field-observation dataset with source references and NOAA NCEI accession links in the rows. It is **not a live sensor feed** and must not be described as real-time monitoring.

The CSV contains fields including:
- `Unique ID`: identifier for an individual sample record.
- `Sample Date`: date/time the sample was collected.
- `Latitude (degree)`, `Longitude (degree)`: sample coordinates used to place records on the map.
- `Ocean`, `Region`, `Country`, `State`, `Beach Location`, `Marine Setting`: sample-site context.
- `Sampling Method`, `Mesh Size (mm)`, `Sediment Sample Depth (m)`: collection methodology.
- `Microplastics Measurement`, `Unit`: measured concentration and its unit. Units are kept separate during aggregation; for example, pieces/m3 are never averaged with pieces/kg.
- `Concentration Class` and `Concentration Class Range`: source-provided concentration category.
- `Short Reference`, `Long Reference`, `DOI`, `NCEI Accession Link`: traceability to the source publication/record.

## How the CSV is used by the application

1. Express starts and mounts `/api/pollution` from `server/routes/pollutionroutes.js`.
2. `GET /api/pollution/map` runs `getPollutionMap` in `server/controllers/pollutioncontroller.js`.
3. The controller reads the CSV from disk with `csv-parse`, validates coordinates and numeric measurements, and skips incomplete rows.
4. Rows are grouped by country, beach/site, rounded coordinates, marine setting, sampling method, and measurement unit. This avoids averaging across unlike settings, methods, or units. The API returns one map hotspot per group, with its sample count, mean concentration, common concentration class, date range, DOI/reference, and NCEI accession link.
5. The original concentration class is mapped to a **display-only class score** (Very Low 15, Low 35, Medium 60, High 80, Very High 95) so the existing color scale and slider can work. This score is not a scientific risk index and is not calculated from a live sensor. NOAA notes that concentration thresholds differ by marine setting and that results from different studies/methods may not be directly comparable; consult each record's metadata and original paper before drawing conclusions.
6. The React map requests the endpoint through `client/src/api/pollutionApi.js`. When the backend is unavailable, it deliberately shows illustrative demo markers and a warning instead of pretending those are measurements.

Dataset documentation: [NOAA NCEI Marine Microplastics Map help](https://www.ncei.noaa.gov/products/microplastics/help) and [NOAA NCEI database paper](https://doi.org/10.1038/s41597-023-02632-y).\n\nThe CSV is read and cached in backend memory. `POST /api/pollution/import` clears that cache and reloads the bundled file; it does not upload a new file or write records to MongoDB.

## API endpoints

- `GET /api/health`: confirms the API process is responding and indicates whether MongoDB is configured.
- `GET /api/pollution/map`: CSV-backed map hotspots and dataset metadata.
- `GET /api/pollution/stats`: sample count, site count, and display-class summary.
- `POST /api/pollution/import`: reloads the bundled CSV cache.

## Deploying the backend and connecting Vercel

The Vercel project currently serves the Vite/React frontend. It does not automatically run the Express app in `server/`. Deploy the Express service separately (for example, using the included Render blueprint).

After creating the backend service:
1. Wait for its URL, for example `https://reefwatch-api.onrender.com`.
2. Check `https://YOUR-BACKEND-URL/api/health`.
3. Check `https://YOUR-BACKEND-URL/api/pollution/map`; the JSON should include `source: "NOAA NCEI marine microplastics dataset"`, `isLive: false`, `totalReadings`, and `hotspots`.
4. In Vercel → Project → Settings → Environment Variables, set `VITE_API_BASE_URL` to `https://YOUR-BACKEND-URL/api` for Preview and Production, then redeploy the frontend.
5. Set backend `CLIENT_URL` to the production frontend origin. The server also permits Reefwatch-named Vercel preview domains for review deployments.

MongoDB is optional for the CSV-backed pollution map. Set `MONGO_URI` to enable database-backed accounts, saved scans, and reports. Those features are not replaced by the CSV.

## Main frontend files

- `client/index.html`: Vite HTML shell and React mount point.
- `client/src/main.jsx`: actual JavaScript entry point; loads global CSS and mounts React.
- `client/src/App.jsx`: renders the route tree.
- `client/src/routes/AppRoutes.jsx`: URL-to-page routing for home, dashboard, login, register, and not-found.
- `client/src/pages/HomePage.jsx`: public landing page, feature sections, and navigation links.
- `client/src/pages/DashboardPage.jsx`: dashboard heading and map component.
- `client/src/components/dashboard/MarineMapView.jsx`: Leaflet map, OpenStreetMap tiles, filters, marker popups, summary values, API loading, and demo fallback.
- `client/src/components/common/Navbar.jsx`: top navigation.
- `client/src/pages/LoginPage.jsx`, `RegisterPage.jsx`, `NotFoundPage.jsx`: login/register shells and unknown-route page.
- `client/src/api/axiosInstance.js`: shared Axios client, API base URL, credentials, and JWT header.
- `client/src/api/authApi.js`, `userApi.js`, `coralApi.js`, `densityApi.js`, `pollutionApi.js`, `reportApi.js`, `speciesApi.js`: small wrappers around backend endpoints.
- `client/src/styles/globals.css`, `tailwind.css`, `index.css`, `App.css`: global styles and Vite starter styles.
- `client/vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `eslint.config.js`: development/build, styling, and lint configuration.
- `client/package.json` and `package-lock.json`: frontend dependencies and pinned dependency tree.
- `client/.env.example`: documents `VITE_API_BASE_URL`.
- `client/vercel.json`: rewrites deep links such as `/dashboard` to `index.html`, so React Router can handle them.
- `client/public/favicon.svg`, `icons.svg`, `src/assets/*`: browser iconography and bundled visual assets.

Note: `client/src/main.jsx` and `App.jsx` are the active entry path. The parallel `main.tsx`, `App.tsx`, and some starter CSS files are Vite/TypeScript template leftovers and are not imported by the current app entry.

## Main backend files

- `server/server.js`: Express app, CORS, JSON parsing, route mounting, health endpoint, and server startup. MongoDB is optional for the CSV map route.
- `server/config/db.js`: MongoDB connection and connection lifecycle.
- `server/config/cloudinary.js`: Cloudinary configuration for media storage.
- `server/config/hfconfig.js`, `server/services/huggingFaceService.js`: Hugging Face inference client configuration and image classification helper.
- `server/routes/*routes.js`: defines API URL paths and connects them to controllers.
- `server/controllers/pollutioncontroller.js`: reads/aggregates the CSV and returns map/stats data. This is now the active CSV data path.
- `server/controllers/densitycontroller.js`: currently returns hard-coded illustrative reef-density data.
- `server/controllers/authcontroller.js`, `usercontroller.js`, `coralcontrollers.js`, `speciescontroller.js`, `reportcontroller.js`, `detectioncontroller.js`: request handlers for accounts, users, coral analysis, species, reports, and detection.
- `server/models/*`: Mongoose schemas for users, species, detections, coral/density/pollution analyses, and reports.
- `server/services/*`: business-logic helpers. Several current analysis services return mock results and are not full production AI integrations yet.
- `server/middleware/authmiddleware.js`: JWT authentication/authorization.
- `server/middleware/uploadmiddleware.js`: upload handling.
- `server/middleware/errormiddleware.js`: common API error responses.
- `server/middleware/validationmiddleware.js`: request validation middleware.
- `server/validators/*`: validation rules for incoming payloads.
- `server/utils/apierror.js`, `generatetoken.js`, `imageprocessor.js`: shared errors, JWT creation, and image utilities.
- `server/utils/samplehotspots.js`: an older sample-hotspot list; the CSV-backed pollution controller does not use it.
- `server/uploads/microplastics.csv`: source dataset used by the pollution map.
- `server/package.json` and `package-lock.json`: backend dependencies; `csv-parse` is used to read the dataset.
- `server/.env.example`: backend environment-variable template.
- `server/.gitignore`: excludes secrets, logs, and generated folders.

## Important limitations to keep clear

- CSV observations are historical research samples, not current conditions.
- The map's 0–100 score is a visual mapping of the source's concentration class, not a newly validated pollution-risk model.
- Different measurement units are not combined into one average.
- The other backend modules still contain mock/stub behavior; do not present every Reefwatch feature as fully connected to live AI or sensor data.
