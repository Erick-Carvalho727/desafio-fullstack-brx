const db = require('../config/database');
const docClient = require('../config/aws');
const { PutCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({ region: process.env.AWS_REGION });

const createUser = async (userData) => {
  //PostgreSQL 
  const { name, email } = userData;
  const query = {
    text: `
    INSERT INTO users (name, email)
    VALUES ($1, $2)
    RETURNING *
    `,
    values: [name, email],
  };
  const { rows } = await db.query(query);
  const newUserInSql = rows[0];

  //DynamoDB
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      id: newUserInSql.id,
      name: newUserInSql.name,
      email: newUserInSql.email,
      avatar_url: newUserInSql.avatar_url,
      created_at: newUserInSql.created_at.toISOString(),
    },
  });
  await docClient.send(command);

  return newUserInSql;
}

const getAllUsers = async () => {
  const query = {
    text: `SELECT * FROM users ORDER BY created_at DESC`,
  };
  const { rows } = await db.query(query);
  return rows;
};

const getUserById = async (id) => {
  const query = {
    text: `SELECT * FROM users WHERE id = $1`,
    values: [id],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const updateUser = async (id, userData) => {
  //PostgreSQL
  const { name, email } = userData;
  const query = {
    text: `
    UPDATE users
    SET name = $1, email = $2
    WHERE id = $3
    RETURNING *
    `,
    values: [name, email, id],
  };

  const { rows } = await db.query(query);
  const updatedUserInSql = rows[0];

   if (!updatedUserInSql) {
    return null;
  }

  //DynamoDB
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      id: updatedUserInSql.id,
      name: updatedUserInSql.name,
      email: updatedUserInSql.email,
      avatar_url: updatedUserInSql.avatar_url,
      created_at: updatedUserInSql.created_at.toISOString(),
    },
  });

  await docClient.send(command);

  return updatedUserInSql;
};

const deleteUser = async (id) => {
  //PostgreSQL
  const query = {
    text: `DELETE FROM users WHERE id = $1`,
    values: [id],
  };
  const result = await db.query(query);
  
  //DynamoDB
  if (result.rowCount > 0) {
    const command = new DeleteCommand({
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: { id },
    });

    await docClient.send(command);
  };

  return result.rowCount;
};

const updateUserAvatar = async (id, avatarUrl) => {
  const query = {
    text: `
      UPDATE users
      SET avatar_url = $1
      WHERE id = $2
      RETURNING *
    `,
    values: [avatarUrl, id],
  };
  const { rows } = await db.query(query);
  const updatedAvatarInSql =  rows[0];

  if (!updatedAvatarInSql) {
    return null;
  }

  //DynamoDB
  const command = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      id: updatedAvatarInSql.id,
      name: updatedAvatarInSql.name,
      email: updatedAvatarInSql.email,
      avatar_url: updatedAvatarInSql.avatar_url,
      created_at: updatedAvatarInSql.created_at.toISOString(),
    },
  });

  await docClient.send(command);

  return updatedAvatarInSql;
};

const deleteAvatar = async (id) => { 
  const userQuery = { text: 'SELECT avatar_url FROM users WHERE id = $1', values: [id] };
  const { rows: userRows } = await db.query(userQuery);
  const user = userRows[0];

  if (user && user.avatar_url) {
    const oldKey = user.avatar_url.split('/').pop();
    const deleteParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: oldKey,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
  }

  //PostgreSQL
  const updateQuery = {
    text: 'UPDATE users SET avatar_url = NULL WHERE id = $1 RETURNING *',
    values: [id],
  };
  const { rows } = await db.query(updateQuery);
  const updatedUserInSql = rows[0];


  //DynamoDB
  const dynamoCommand = new PutCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: {
      id: updatedUserInSql.id,
      name: updatedUserInSql.name,
      email: updatedUserInSql.email,
      avatar_url: null,
      created_at: updatedUserInSql.created_at.toISOString(),
    },
  });
  await docClient.send(dynamoCommand);

  return updatedUserInSql;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateUserAvatar,
  deleteAvatar,
};