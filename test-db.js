const pool = require("./database");

async function testConnection() {
  try {
    const classifications = await pool.query("SELECT * FROM classification");
    const inventory = await pool.query("SELECT * FROM inventory");
    const oneVehicle = await pool.query("SELECT * FROM inventory WHERE inv_id = 1");

    console.log("Classification rows:", classifications.rows);
    console.log("Inventory rows:", inventory.rows);
    console.log("Vehicle 1:", oneVehicle.rows);
    process.exit();
  } catch (error) {
    console.error("DB TEST FAILED:");
    console.error(error);
    process.exit(1);
  }
}

testConnection();