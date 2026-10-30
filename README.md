# REEFWATCH
```text

backend/
├── config/
│   ├── db.js
│   ├── hfConfig.js
│   └── cloudinary.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── speciesController.js
│   ├── coralController.js
│   ├── pollutionController.js
│   ├── densityController.js
│   └── reportController.js
├── models/
│   ├── User.js
│   ├── Species.js
│   ├── SpeciesDetection.js
│   ├── CoralAnalysis.js
│   ├── PollutionAnalysis.js
│   ├── DensityAnalysis.js
│   └── Report.js
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── speciesRoutes.js
│   ├── coralRoutes.js
│   ├── pollutionRoutes.js
│   ├── densityRoutes.js
│   └── reportRoutes.js
├── services/
│   ├── huggingFaceService.js
│   ├── speciesDetectionService.js
│   ├── coralAnalysisService.js
│   ├── pollutionAnalysisService.js
│   ├── densityAnalysisService.js
│   └── reportService.js
├── middleware/
│   ├── authMiddleware.js
│   ├── uploadMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── utils/
│   ├── generateToken.js
│   ├── imageProcessor.js
│   └── ApiError.js
├── validators/
│   ├── authValidator.js
│   ├── speciesValidator.js
│   ├── coralValidator.js
│   └── pollutionValidator.js
├── uploads/
├── app.js
├── server.js
├── .env
├── .env.example
├── .gitignore
└── package.json

└── frontend/
    ├── public/
    │   ├── favicon.ico
    │   ├── logo.svg
    │   └── sample-corals/
    │       ├── brain-coral.jpg
    │       ├── staghorn-coral.jpg
    │       └── bleached-coral.jpg
    ├── src/
    │   ├── api/
    │   │   ├── axiosInstance.js
    │   │   ├── authApi.js
    │   │   ├── userApi.js
    │   │   ├── speciesApi.js
    │   │   ├── coralApi.js
    │   │   ├── pollutionApi.js
    │   │   ├── densityApi.js
    │   │   └── reportApi.js
    │   ├── assets/
    │   │   ├── icons/
    │   │   └── images/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx
    │   │   │   ├── Sidebar.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── ProtectedRoute.jsx
    │   │   │   ├── LoadingSpinner.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   └── AlertBanner.jsx
    │   │   ├── auth/
    │   │   │   ├── LoginForm.jsx
    │   │   │   ├── RegisterForm.jsx
    │   │   │   └── ResetPasswordForm.jsx
    │   │   ├── scanner/
    │   │   │   ├── ImageUploader.jsx
    │   │   │   ├── CameraCapture.jsx
    │   │   │   ├── BoundingBoxCanvas.jsx
    │   │   │   └── ScanProgressTracker.jsx
    │   │   ├── coral/
    │   │   │   ├── CoralHealthCard.jsx
    │   │   │   ├── BleachingGauge.jsx
    │   │   │   └── CoralTypeBadge.jsx
    │   │   ├── species/
    │   │   │   ├── SpeciesCard.jsx
    │   │   │   ├── SpeciesGrid.jsx
    │   │   │   ├── SpeciesDetailModal.jsx
    │   │   │   └── SpeciesSearchFilter.jsx
    │   │   ├── pollution/
    │   │   │   ├── PollutionSeverityCard.jsx
    │   │   │   ├── DebrisBreakdownChart.jsx
    │   │   │   └── WaterClarityMeter.jsx
    │   │   ├── density/
    │   │   │   ├── CoverageChart.jsx
    │   │   │   └── DensityHeatmap.jsx
    │   │   ├── reports/
    │   │   │   ├── ReportGeneratorForm.jsx
    │   │   │   ├── ReportTable.jsx
    │   │   │   ├── ReportPreviewModal.jsx
    │   │   │   └── ExportButton.jsx
    │   │   └── dashboard/
    │   │       ├── StatsOverview.jsx
    │   │       ├── RecentScansList.jsx
    │   │       └── MarineMapView.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── ScanContext.jsx
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   ├── useImageScanner.js
    │   │   ├── useCoralAnalysis.js
    │   │   ├── useSpeciesCatalog.js
    │   │   └── useReports.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ScannerPage.jsx
    │   │   ├── AnalysisDetailsPage.jsx
    │   │   ├── SpeciesCatalogPage.jsx
    │   │   ├── ReportsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── NotFoundPage.jsx
    │   ├── routes/
    │   │   └── AppRoutes.jsx
    │   ├── styles/
    │   │   ├── globals.css
    │   │   └── tailwind.css
    │   ├── utils/
    │   │   ├── constants.js
    │   │   ├── formatters.js
    │   │   ├── canvasHelpers.js
    │   │   └── exportHelpers.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
