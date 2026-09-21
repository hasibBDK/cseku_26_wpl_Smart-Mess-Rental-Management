import { Router } from "express";
import { applyToTuition, createTuition, listTuitions, selectStudent } from "../controllers/tuitionController.js";
import { allowRoles, authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/", listTuitions);
router.post("/", allowRoles("guardian"), createTuition);
router.post("/:id/apply", allowRoles("student"), applyToTuition);
router.patch("/:id/select/:studentId", allowRoles("guardian"), selectStudent);

export default router;
