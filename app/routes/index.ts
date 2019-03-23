import { Router } from "express";
import { authRoutes } from './auth';

const router = Router();

router.get('/', (req, res, next) => {
    res.json({
      status: "success",
      message: "Demo API server",
      data: {
        "version_number": "v1.0.0"
      }
    })
  });
router.use('/auth', authRoutes);

export const apiRouter = router;