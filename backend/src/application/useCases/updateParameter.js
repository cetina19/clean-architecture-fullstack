class UpdateParameter {
  constructor(parameterRepository) {
    this.parameterRepository = parameterRepository;
  }

  async execute(parameter) {
    const existingParameter = await this.parameterRepository.getParameterById(parameter.id);

    if (!existingParameter) {
      throw new Error('Parameter not found.');
    }
    try {
      const updatedParameter = await this.parameterRepository.updateParameter(parameter);
      return updatedParameter;
    } catch (error) {
      if (error.message === 'Parameter update conflict.') {
        throw new Error('The parameter was modified by another user. Please refresh and try again.');
      }
      throw error;
    }
  }
}

module.exports = UpdateParameter;
