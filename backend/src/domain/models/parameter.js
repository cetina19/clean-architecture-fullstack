class Parameter {
    constructor({ id, freeUsageLimit, supportEmail, privacyPage, minimumVersion, latestVersion, compressionQuality, btnText, version, countryCode }) {
      this.id = id;
      this.freeUsageLimit = freeUsageLimit;
      this.supportEmail = supportEmail;
      this.privacyPage = privacyPage;
      this.minimumVersion = minimumVersion;
      this.latestVersion = this.updateLatestVersion(latestVersion, countryCode);
      this.compressionQuality = compressionQuality;
      this.btnText = btnText;
      this.version = version;
    }
    updateLatestVersion(latestVersion, countryCode) {
      if (countryCode !== undefined && countryCode === "TR") {
        const versionParts = latestVersion.split('.');
        
        if (versionParts.length === 1) {
          return `${latestVersion}.1`;
        } else {
          const major = versionParts[0];
          const minor = parseInt(versionParts[1], 10) + 1;
          return `${major}.${minor}`;
        }
      } else {
        return latestVersion;
      }
    }
  }
  


  module.exports = Parameter;
  