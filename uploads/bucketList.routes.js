import express from "express";
import BucketListController from "./bucketList.controller.js";

const router = express.Router();

const bucketListController = new BucketListController();

router.post("/", bucketListController.add);
router.get("/", bucketListController.get);

export default router;
