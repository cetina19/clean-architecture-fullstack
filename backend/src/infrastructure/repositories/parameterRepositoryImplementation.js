const ParameterRepository = require('../../domain/repositories/parameterRepository');
const Parameter = require('../../domain/models/parameter');
const db = require('../database/db');

class ParameterRepositoryImplementation extends ParameterRepository {
  async getAllParameters(code, sort) {
    const result = await db.query('SELECT * FROM parameters_table');
    return result.rows.map(row => new Parameter({
      freeUsageLimit: row.freeusagelimit,
      supportEmail: row.supportemail,
      privacyPage: row.privacypage,
      minimumVersion: row.minimumversion,
      latestVersion: row.latestversion,
      compressionQuality: row.compressionquality,
      btnText: row.btntext,
    }));
  }


  async createParameter(parameter) {
    const result = await db.query(
      `INSERT INTO parameters_table (freeusagelimit, supportemail, privacypage, minimumversion, latestversion, compressionquality, btntext)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [parameter.freeUsageLimit, parameter.supportEmail, parameter.privacyPage, parameter.minimumVersion, parameter.latestVersion, parameter.compressionQuality, parameter.btnText]
    );

    const row = result.rows[0];
    return new Parameter({
      id: row.id,
      freeUsageLimit: row.freeusagelimit,
      supportEmail: row.supportemail,
      privacyPage: row.privacypage,
      minimumVersion: row.minimumversion,
      latestVersion: row.latestversion,
      compressionQuality: row.compressionquality,
      btnText: row.btntext,
    });
  }

  
  async getParameterById(id) {
    const result = await db.query('SELECT * FROM parameters_table WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new Parameter({
      id: row.id,
      parameterKey: row.parameter_key,
      value: row.value,
      description: row.description,
      createDate: row.create_date,
      version: row.version,
    });
  }

  async deleteParameter(id) {
    await db.query('DELETE FROM parameters_table WHERE id = $1', [id]);
  }

  async updateParameter(parameter) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN'); 
  
      const lockQuery = `
        SELECT *
        FROM parameters_table
        WHERE id = $1::int
        FOR UPDATE
      `;
      const lockResult = await client.query(lockQuery, [parameter.id]);
  
      if (lockResult.rows.length === 0) {
        throw new Error('Parameter not found.');
      }
  
      const currentRow = lockResult.rows[0];
      const currentVersion = currentRow.version;
  
      const latestPreviousVersionQuery = `
        SELECT *
        FROM previous_versions
        WHERE parameter_id = $1::int
        ORDER BY version DESC
        LIMIT 1
      `;
      const latestPreviousVersionResult = await client.query(latestPreviousVersionQuery, [parameter.id]);
      const latestPreviousVersion = latestPreviousVersionResult.rows[0];
  
      const fields = [
        { name: 'freeUsageLimit', dbField: 'freeusagelimit' },
        { name: 'supportEmail', dbField: 'supportemail' },
        { name: 'privacyPage', dbField: 'privacypage' },
        { name: 'minimumVersion', dbField: 'minimumversion' },
        { name: 'latestVersion', dbField: 'latestversion' },
        { name: 'compressionQuality', dbField: 'compressionquality' },
        { name: 'btnText', dbField: 'btntext' },
      ];
  
      const conflictingFields = [];

      const now = new Date();

    let timeDiffSeconds = null;
    if (latestPreviousVersion && latestPreviousVersion.updated_at) {
      const updatedAt = new Date(latestPreviousVersion.updated_at);
      timeDiffSeconds = (now - updatedAt) / 1000; // in milliseconds
    }
  
      fields.forEach(field => {
        const userValue = parameter[field.name];
        if (userValue === undefined) {
          return;
        }
  
        const latestPrevious = latestPreviousVersion ? latestPreviousVersion[field.dbField] : null;
        const currentValue = currentRow[field.dbField];
        const newValue = userValue;
  
        if (latestPrevious === newValue) {
          parameter[field.name] = currentValue;
        } else if (latestPrevious !== newValue && latestPrevious !== currentValue && newValue !== currentValue) {
          if (timeDiffSeconds !== null && timeDiffSeconds < 100) {
            conflictingFields.push(field.name);
          }
        }
      });
  
      if (conflictingFields.length > 0) {
        throw new Error(`Conflicting updates detected on fields: ${conflictingFields.join(', ')}.`);
      }
  
      const insertPreviousVersionQuery = `
        INSERT INTO previous_versions (
          parameter_id,
          freeusagelimit,
          supportemail,
          privacypage,
          minimumversion,
          latestversion,
          compressionquality,
          btntext,
          version
        )
        VALUES ($1::int, $2::int, $3::text, $4::text, $5::text, $6::text, $7::numeric, $8::text, $9::int)
      `;
      const insertValues = [
        currentRow.id,
        currentRow.freeusagelimit,
        currentRow.supportemail,
        currentRow.privacypage,
        currentRow.minimumversion,
        currentRow.latestversion,
        currentRow.compressionquality,
        currentRow.btntext,
        currentVersion,
      ];
      await client.query(insertPreviousVersionQuery, insertValues);
  
      const updateQuery = `
        UPDATE parameters_table
        SET 
          freeusagelimit = COALESCE($1::int, freeusagelimit), 
          supportemail = COALESCE($2::text, supportemail), 
          privacypage = COALESCE($3::text, privacypage),
          minimumversion = COALESCE($4::text, minimumversion),
          latestversion = COALESCE($5::text, latestversion),
          compressionquality = COALESCE($6::numeric, compressionquality),
          btntext = COALESCE($7::text, btntext),
          version = version + 1
        WHERE id = $8::int
        RETURNING *
      `;
  
      const updateValues = [
        parameter.freeUsageLimit,
        parameter.supportEmail,
        parameter.privacyPage,
        parameter.minimumVersion,
        parameter.latestVersion,
        parameter.compressionQuality,
        parameter.btnText,
        parameter.id,
      ];
  
      const updateResult = await client.query(updateQuery, updateValues);
  
      if (updateResult.rows.length === 0) {
        throw new Error('Failed to update parameter.');
      }
  
      await client.query('COMMIT');
  
      const row = updateResult.rows[0];
      return new Parameter({
        id: row.id,
        freeUsageLimit: row.freeusagelimit,
        supportEmail: row.supportemail,
        privacyPage: row.privacypage,
        minimumVersion: row.minimumversion,
        latestVersion: row.latestversion,
        compressionQuality: row.compressionquality,
        btnText: row.btntext,
        version: row.version,
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error updating parameter:', error.message);
      throw error;
    } finally {
      client.release();
    }
  }
  
  
}

module.exports = ParameterRepositoryImplementation;
