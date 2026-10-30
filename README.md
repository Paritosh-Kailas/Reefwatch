#REEFWATCH
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
