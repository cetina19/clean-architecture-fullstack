const FrontendParameter = require('../../domain/models/frontendParameter');
class CreateParameter {
    constructor(parameterRepository) {
      this.parameterRepository = parameterRepository;
    }
  
    async execute(data) {
      const parameter = await new FrontendParameter({
        parameterKey: data.parameterKey,
        value: data.value,
        description: data.description
      });
  
      return await this.parameterRepository.createParameter(parameter);
    }
  }
  
  module.exports = CreateParameter;
  