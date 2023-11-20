const mariadb = require("mariadb");

// En este módulo creamos la conexión con la base de datos
const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "todolist",
  connectionLimit: 5,
});

const getTasks = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT id, name, status FROM todoist");
    return rows;
  } catch (err) {
  } finally {
    if (conn) conn.release();
  }
  return false;
};

const getTaskById = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM todoist WHERE id =?", id);
    return rows[0];
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release();
  }
  return false;
};

const createTask = async (task) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO todoist(name, status) VALUE(?, ?)`,
      [task.name, task.status]
    );

    return { id: parseInt(response.insertId), ...task };
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

const updateTask = async (id, task) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(`UPDATE todoist SET name=?, status=? WHERE id=?`, [
      task.name,
      task.status,
      id,
    ]);

    return { id, ...task };
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

const deleteTask = async (id) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM todoist WHERE id=?", [id]);
    return true;
  } catch (error) {
    console.log(error);
  } finally {
    if (conn) conn.release(); //release to pool
  }
  return false;
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
