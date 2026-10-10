import { Router } from "express";
import { applyToTuition, createTuition, forwardTuition, listAdminTuitions, listMySelectedTuitions, listTuitions, selectStudent, submitPayment } from "../controllers/tuitionController.js";
import { allowRoles, authenticate } from "../middleware/authenticate.js";

const router = Router();

router.use(authenticate);
router.get("/", listTuitions);
router.post("/", allowRoles("guardian", "student"), createTuition);
router.post("/:id/apply", allowRoles("student"), applyToTuition);
router.patch("/:id/select/:studentId", allowRoles("guardian"), selectStudent);
router.get("/admin/selected", allowRoles("admin"), listAdminTuitions);
router.patch("/admin/:id/forward", allowRoles("admin"), forwardTuition);
router.get("/selected/me", allowRoles("student"), listMySelectedTuitions);
router.post("/:id/payment", allowRoles("student"), submitPayment);

export default router;
