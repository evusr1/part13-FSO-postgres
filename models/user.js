const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isDisabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  defaultScope: {
    attributes: {
      exclude: ['passwordHash']
    }
  },
  hooks: {
    afterCreate: (record) => {
      delete record.dataValues.passwordHash
    },
    afterUpdate: (record) => {
      delete record.dataValues.passwordHash
    },
  },
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})

module.exports = User

