const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Species = sequelize.define("Species", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM("PLANT", "ANIMAL"),
    allowNull: false,
  },
  scientificName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  status: {
    type: DataTypes.ENUM("AVAILABLE", "RESERVED", "OUT_OF_STOCK"),
    defaultValue: "AVAILABLE",
  },
  minimumThreshold: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  habitatRequirements: {
    type: DataTypes.JSON, // Stores complex habitat data as a JSON object
  },
  certifications: {
    type: DataTypes.JSON, // Using JSON instead of ARRAY for MySQL compatibility
  },
});

module.exports = Species;
