const Parameter = require('../../domain/models/parameter');
const GetParameters = require('../../application/useCases/getParameters');
const CreateParameter = require('../../application/useCases/createParameter');
const parameterRepositoryImplementation = require('../../infrastructure/repositories/parameterRepositoryImplementation');
const DeleteParameter = require('../../application/useCases/deleteParameter');
const UpdateParameter = require('../../application/useCases/updateParameter');


const parameterRepository = new parameterRepositoryImplementation();
const getParametersUseCase = new GetParameters(parameterRepository);
const createParameterUseCase = new CreateParameter(parameterRepository);
const deleteParameterUseCase = new DeleteParameter(parameterRepository);
const updateParameterUseCase = new UpdateParameter(parameterRepository);

const getParameters = async (req, res, next) => {
  try {
    const countryCode = req.query.countryCode === undefined ? 'UK' : req.query.countryCode;
    const sort = req.query.sort  === undefined ? 'ASC' : req.query.sort ;

    if (countryCode) {
      const countryCodeRegex = /^[A-Z]{2}$/;
      if (!countryCodeRegex.test(countryCode)) {
        return res.status(400).json({ message: 'Invalid countryCode format.' });
      }
    }
    
    const parameters = await getParametersUseCase.execute(countryCode, sort);
    res.status(200).json(parameters);
  } catch (error) {
    next(error);
  }
};

const createParameter = async (req, res, next) => {
  try {
    const data = {
      freeUsageLimit: req.body.freeUsageLimit,
      supportEmail: req.body.supportEmail,
      privacyPage: req.body.privacyPage,
      minimumVersion: req.body.minimumVersion,
      latestVersion: req.body.latestVersion,
      compressionQuality: req.body.compressionQuality,
      btnText: req.body.btnText,
    };

    const parameter = await createParameterUseCase.execute(data);
    res.status(201).json(parameter);
  } catch (error) {
    next(error);
  }
};

const deleteParameter = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await deleteParameterUseCase.execute(id);
    res.status(204).send();  
  } catch (error) {
    next(error);
  }
};

const updateParameter = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid parameter ID.' });
    }

    const data = {
      id: id,
      freeUsageLimit: req.body.freeUsageLimit,
      supportEmail: req.body.supportEmail,
      privacyPage: req.body.privacyPage,
      minimumVersion: req.body.minimumVersion,
      latestVersion: req.body.latestVersion,
      compressionQuality: req.body.compressionQuality,
      btnText: req.body.btnText,
    };

    const parameter = new Parameter(data);

    const updatedParameter = await updateParameterUseCase.execute(parameter);

    res.status(200).json({
      id: updatedParameter.id,
      parameterKey: updatedParameter.parameterKey,
      value: updatedParameter.value,
      description: updatedParameter.description,
      createDate: updatedParameter.createDate,
      version: updatedParameter.version,
    });
  } catch (error) {
    if (error.message.includes('modified by another user')) {
      res.status(409).json({ error: error.message });
    } else {
      next(error);
    }
  }
};



module.exports = {
  getParameters,
  createParameter,
  deleteParameter,
  updateParameter,
};
