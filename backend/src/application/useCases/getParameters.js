class GetParameters {
  constructor(parameterRepository) {
    this.parameterRepository = parameterRepository;
  }

  async execute(code, sort) {
    return await this.parameterRepository.getAllParameters(code, sort);
  }
}

module.exports = GetParameters;
