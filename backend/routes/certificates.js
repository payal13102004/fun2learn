import express from "express";
import { saveCertificate, getMyCertificates, getAllCertificates } from "../controllers/certificateController.js";
import { authenticate, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save", authenticate, saveCertificate);
router.get("/my", authenticate, getMyCertificates);
router.get("/all", authenticate, isAdmin, getAllCertificates);

export default router;
