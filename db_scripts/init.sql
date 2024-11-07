CREATE TABLE parameters_table (
    id SERIAL PRIMARY KEY,
    freeUsageLimit INT NOT NULL,
    supportEmail VARCHAR(255) NOT NULL,
    privacyPage VARCHAR(512) NOT NULL,
    minimumVersion VARCHAR(10) NOT NULL,
    latestVersion VARCHAR(10) NOT NULL,
    compressionQuality DECIMAL(3,2) NOT NULL,
    btnText VARCHAR(100) NOT NULL,
    version INT NOT NULL DEFAULT 1
);

CREATE INDEX idx_freeusagelimit ON parameters_table (freeUsageLimit);
CREATE INDEX idx_supportemail ON parameters_table (supportEmail);
CREATE INDEX idx_privacypage ON parameters_table (privacyPage);
CREATE INDEX idx_minimumversion ON parameters_table (minimumVersion);
CREATE INDEX idx_latestversion ON parameters_table (latestVersion);
CREATE INDEX idx_compressionquality ON parameters_table (compressionQuality);
CREATE INDEX idx_btntext ON parameters_table (btnText);
CREATE INDEX idx_version ON parameters_table(version);

CREATE TABLE previous_versions (
    id SERIAL PRIMARY KEY,
    parameter_id INT NOT NULL,
    freeusagelimit INT,
    supportemail TEXT,
    privacypage TEXT,
    minimumversion TEXT,
    latestversion TEXT,
    compressionquality NUMERIC,
    btntext TEXT,
    version INT NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

ALTER TABLE previous_versions
ADD CONSTRAINT fk_parameter
FOREIGN KEY (parameter_id) REFERENCES parameters_table(id)
ON DELETE CASCADE;

CREATE INDEX idx_previous_versions_parameter_id ON previous_versions(parameter_id);
CREATE INDEX idx_previous_versions_version ON previous_versions(version);

INSERT INTO parameters_table (
    freeUsageLimit, supportEmail, privacyPage, minimumVersion, latestVersion, compressionQuality, btnText
) VALUES (
    5, 'support@abcd.co', 'https://abcd.com/privacy_en.html', '1.0', '2.1', 0.7, 'Try now!'
);


CREATE TABLE frontend_parameters (
    id SERIAL PRIMARY KEY,
    parameterKey VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    createDate VARCHAR(16) NOT NULL,
    version INT NOT NULL DEFAULT 1
);

CREATE INDEX idx_parameterkey ON frontend_parameters (parameterKey);
CREATE INDEX idx_value ON frontend_parameters (value);
CREATE INDEX idx_description ON frontend_parameters (description);
CREATE INDEX idx_createdate ON frontend_parameters (createDate);
CREATE INDEX idx_frontend_version ON frontend_parameters (version);

CREATE TABLE frontend_parameters_previous_versions (
    id SERIAL PRIMARY KEY,
    parameter_id INT NOT NULL,
    parameterKey VARCHAR(255) NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    createDate VARCHAR(16) NOT NULL,
    version INT NOT NULL,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (NOW() AT TIME ZONE 'utc')
);

ALTER TABLE frontend_parameters_previous_versions
ADD CONSTRAINT fk_frontend_parameter
FOREIGN KEY (parameter_id) REFERENCES frontend_parameters(id)
ON DELETE CASCADE;

CREATE INDEX idx_frontend_previous_versions_parameter_id ON frontend_parameters_previous_versions(parameter_id);
CREATE INDEX idx_frontend_previous_versions_version ON frontend_parameters_previous_versions("version");

INSERT INTO frontend_parameters (
    parameterKey, value, description, createDate
) VALUES (
    'min_version', '1.4.4', 'Minimum required version of the app', '10/05/2021 01:58'
);

INSERT INTO frontend_parameters (
    parameterKey, value, description, createDate
) VALUES (
    'latest_version', '1.4.7', 'Latest version of the app', '10/05/2021 01:58'
);

INSERT INTO frontend_parameters (
    parameterKey, value, description, createDate
) VALUES (
    'pricing_tier', 't6', 'Pricing tier of the user', '07/07/2021 11:13'
);

INSERT INTO frontend_parameters (
    parameterKey, value, description, createDate
) VALUES (
    'scroll', '5', 'Index of Scroll Paywall for free users.', '25/08/2021 10:22'
);

INSERT INTO frontend_parameters (
    parameterKey, value, description, createDate
) VALUES (
    'scroll_limit', '13', 'Index of Scroll Limit Paywall for free users.', '25/08/2021 10:23'
);
