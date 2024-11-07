const parameterController = require('../controllers/parameterController');
const frontendParameterController = require('../controllers/frontendParameterController');


const getController = (type) => {
  if (type === 'parameters') {
    return parameterController;
  } else if (type === 'frontend_parameters') {
    return frontendParameterController;
  } else {
    return null;
  }
};

const controllerMiddleware = (req, res, next) => {
    const controller = getController(req.params.type);
    if (!controller) {
      return res.status(404).json({ error: 'Invalid parameter type' });
    }
    req.controller = controller;
    next();
  };

module.exports = controllerMiddleware;