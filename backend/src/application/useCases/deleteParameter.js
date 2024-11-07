class DeleteParameter {
    constructor(parameterRepository) {
      this.parameterRepository = parameterRepository;
    }

    async execute(id) {
      const parameter = await this.parameterRepository.getParameterById(id);
      if (!parameter) {
        throw new Error('Parameter not found.');
      }
  
      await this.parameterRepository.deleteParameter(id);
    }
  }
  
  module.exports = DeleteParameter;
  