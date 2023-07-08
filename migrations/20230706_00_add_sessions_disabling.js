const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
      },
      session_token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    })

    await queryInterface.addColumn('users', 'is_disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })

  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'is_disabled')
    await queryInterface.dropTable('sessions')
  }
}