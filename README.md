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

frontend/
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
│
