const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('blogs', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      author: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    })

    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING
      }
    }, )

    await queryInterface.addColumn('blogs', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    })

    await queryInterface.addColumn('blogs', 'created_at', {
      type: DataTypes.DATE
    })

    await queryInterface.addColumn('blogs', 'updated_at', {
      type: DataTypes.DATE
    })

    await queryInterface.addColumn('users', 'created_at', {
      type: DataTypes.DATE
    })

    await queryInterface.addColumn('users', 'updated_at', {
      type: DataTypes.DATE
    })

    await queryInterface.addColumn('users', 'password_hash', {
      type: DataTypes.STRING,
      allowNull: false
    })

  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('blogs')
    await queryInterface.dropTable('users')
  }
}