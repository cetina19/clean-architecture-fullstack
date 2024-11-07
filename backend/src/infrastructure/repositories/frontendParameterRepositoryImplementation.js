const ParameterRepository = require('../../domain/repositories/parameterRepository');
const FrontendParameter = require('../../domain/models/frontendParameter');
const db = require('../database/db');

class FrontendParameterRepositoryImplementation extends ParameterRepository {
  async getAllParameters(code, sort) {
    const query = `
      SELECT *
      FROM frontend_parameters
      ORDER BY id ${sort}
    `;
    const result = await db.query(query);
    return result.rows.map(row => new FrontendParameter({
      id: row.id,
      parameterKey: row.parameterkey,
      value: row.value,
      description: row.description,
      createDate: row.createdate,
      version: row.version,
      countryCode: code
    }));
  }


  async createParameter(parameter) {
    const result = await db.query(
      `INSERT INTO frontend_parameters (parameterKey, value, description, createDate)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [parameter.parameterKey, parameter.value, parameter.description, parameter.createDate]
    );

    const row = result.rows[0];
    return new FrontendParameter({
      id: row.id,
      parameterKey: row.parameterkey,
      value: row.value,
      description: row.description,
      createDate: row.createdate,
    });
  }

  
  async getParameterById(id) {
    const result = await db.query('SELECT * FROM frontend_parameters WHERE id = $1', [id]);
    if (result.rows.length === 0) return null;
    const row = result.rows[0];
    return new FrontendParameter({
      id: row.id,
      parameterKey: row.parameter_key,
      value: row.value,
      description: row.description,
      createDate: row.create_date,
      version: row.version,
    });
  }

  async deleteParameter(id) {
    await db.query('DELETE FROM frontend_parameters WHERE id = $1', [id]);
  }

  async updateParameter(parameter) {
    const client = await db.getClient();
    try {
      await client.query('BEGIN'); 
  
      const lockQuery = `
        SELECT *
        FROM frontend_parameters
        WHERE id = $1::int
        FOR UPDATE
      `;
      const lockResult = await client.query(lockQuery, [parameter.id]);
  
      const currentRow = lockResult.rows[0];
      const currentVersion = currentRow.version;
  
      const latestPreviousVersionQuery = `
        SELECT *
        FROM frontend_parameters_previous_versions
        WHERE parameter_id = $1::int
        ORDER BY version DESC
        LIMIT 1
      `;
      const latestPreviousVersionResult = await client.query(latestPreviousVersionQuery, [parameter.id]);
      const latestPreviousVersion = latestPreviousVersionResult.rows[0];
  
      const fields = [
        { name: 'parameterKey', dbField: 'parameterkey' },
        { name: 'value', dbField: 'value' },
        { name: 'description', dbField: 'description' },
        { name: 'createDate', dbField: 'createdate' }
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
        } else if(latestPrevious === currentValue){
          parameter[field.name] = newValue;
        } else if (latestPrevious !== newValue && latestPrevious !== currentValue && newValue !== currentValue) {
          if (timeDiffSeconds !== null && timeDiffSeconds < 1) {
            conflictingFields.push(field.name);
          }
          else{
            parameter[field.name] = newValue;
          }
        }
      });
  
      if (conflictingFields.length > 0) {
        throw new Error(`Conflicting updates detected on fields: ${conflictingFields.join(', ')}.`);
      }
  
      const insertPreviousVersionQuery = `
        INSERT INTO frontend_parameters_previous_versions (
          parameter_id,
          parameterkey,
          value,
          description,
          createdate,
          version
        )
        VALUES ($1::int, $2::text, $3::text, $4::text, $5::text, $6::int)
      `;
      const insertValues = [
        currentRow.id,
        currentRow.parameterkey,
        currentRow.value,
        currentRow.description,
        currentRow.createdate,
        currentVersion,
      ];
      await client.query(insertPreviousVersionQuery, insertValues);
  
      const updateQuery = `
        UPDATE frontend_parameters
        SET 
          parameterkey = COALESCE($1::text, parameterkey), 
          value = COALESCE($2::text, value), 
          description = COALESCE($3::text, description),
          version = version + 1
        WHERE id = $4::int
        RETURNING *
      `;
  
      const updateValues = [
        parameter.parameterKey,
        parameter.value,
        parameter.description,
        parameter.id,
      ];
  
      const updateResult = await client.query(updateQuery, updateValues);
  
      if (updateResult.rows.length === 0) {
        throw new Error('Failed to update parameter.');
      }
  
      await client.query('COMMIT');
  
      const row = updateResult.rows[0];
      return new FrontendParameter({
        id: row.id,
        parameterKey: row.parameterkey,
        value: row.value,
        description: row.description,
        createDate: row.createDate,
        version: row.version
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

module.exports = FrontendParameterRepositoryImplementation;
