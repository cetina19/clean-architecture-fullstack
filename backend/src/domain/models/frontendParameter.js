class FrontendParameter {
    constructor({ id, parameterKey, value, description, createDate, version, countryCode }) {
        this.id = id;
        this.parameterKey = parameterKey;
        this.value = this.updateValue(value, countryCode);
        this.description = description;
        this.createDate = createDate === undefined ? this.getCurrentDateTime() : createDate;
        this.version = version
    }

    updateValue(value, countryCode) {
        if (countryCode !== undefined && countryCode === "TR" && this.parameterKey === 'latest_version') {
            return this.incrementVersion(value);
        } else {
            return value;
        }
    }

    incrementVersion(versionStr) {
        const versionParts = versionStr.split('.');
    
        for (let i = versionParts.length - 1; i >= 0; i--) {
            const part = versionParts[i];
    
            const match = part.match(/^(.*?)(\d+)([^0-9]*)$/);
            if (match) {
                const prefix = match[1];
                const num = parseInt(match[2], 10);
                const suffix = match[3];
    
                const incrementedNum = num + 1;
    
                versionParts[i] = `${prefix}${incrementedNum}${suffix}`;
    
                return versionParts.join('.');
            }
        }
    
        return versionStr;
    }
    getCurrentDateTime(){
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
      
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      };
}

module.exports = FrontendParameter;
