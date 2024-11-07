const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const verifyPredefinedToken = require("../middlewares/apiTokenMiddleware");
const controllerHandler = require("../middlewares/controllerMiddleware");

router.get('/:type(parameters|frontend_parameters)', verifyPredefinedToken, controllerHandler, (req, res, next) => {
  req.controller.getParameters(req, res, next);
});

router.post('/:type(parameters|frontend_parameters)', verifyToken, controllerHandler, (req, res, next) => {
  req.controller.createParameter(req, res, next);
});

router.delete('/:type(parameters|frontend_parameters)/:id', verifyToken, controllerHandler, (req, res, next) => {
  req.controller.deleteParameter(req, res, next);
});

router.put('/:type(parameters|frontend_parameters)/:id', verifyToken, controllerHandler, (req, res, next) => {
  req.controller.updateParameter(req, res, next);
});

module.exports = router;
