const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");
const MasterResourceController = require("../controllers/master.resource.controller.js");
const {
	validateMasterResource,
} = require("../validations/master.resource.validation.js");
const MulterUploadMiddleware = require("../middlewares/multerUploadMiddleware.js");

const masterResourceController = new MasterResourceController();

router.post(
	"/resource-plan/create",
	isAuthenticated,
	requirePermission("content.manage"),
	validateMasterResource,
	asyncMiddleware(
		masterResourceController.create.bind(masterResourceController)
	)
);

router.get(
	"/resource-plan/list",
	asyncMiddleware(
		masterResourceController.getAll.bind(masterResourceController)
	)
);

router.put(
	"/resource-plan/update/:id",
	isAuthenticated,
	requirePermission("content.manage"),
	validateMasterResource,
	asyncMiddleware(
		masterResourceController.update.bind(masterResourceController)
	)
);

router.post(
	"/resource-plan/regenerate",
	isAuthenticated,
	requirePermission("lesson-resource.edit"),
	asyncMiddleware(
		masterResourceController.regenerate.bind(masterResourceController)
	)
);

router.post(
	"/resource-plan/combo",
	isAuthenticated,
	requirePermission("content.manage"),
	asyncMiddleware(
		masterResourceController.comboScript.bind(masterResourceController)
	)
);

router.post(
	"/resource-plan/learning-outcomes",
	isAuthenticated,
	requirePermission("lesson-resource.generate"),
	asyncMiddleware(
		masterResourceController.getSubtopicResourceList.bind(
			masterResourceController
		)
	)
);

router.get(
	"/master-resource/:resourceId",
	isAuthenticated,
	requirePermission("lesson-resource.generate"),
	asyncMiddleware(
		masterResourceController.generateResourcePlan.bind(masterResourceController)
	)
);

router.post(
	"/master-resource/upload",
	isAuthenticated,
	requirePermission("content.manage"),
	MulterUploadMiddleware,
	asyncMiddleware(
		masterResourceController.uploadMasterResource.bind(masterResourceController)
	)
);

router.post(
	"/master-resource/old-version-upload",
	isAuthenticated,
	requirePermission("content.manage"),
	MulterUploadMiddleware,
	asyncMiddleware(
		masterResourceController.uploadOldMasterResource.bind(masterResourceController)
	)
);


module.exports = router;
