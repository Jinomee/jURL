module.exports = (sequelize, DataTypes) => {
  const Url = sequelize.define('Url', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    originalUrl: {
      type: DataTypes.STRING(2048),
      allowNull: false,
      validate: {
        isUrl: true,
        notEmpty: true,
      },
    },
    shortCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clickCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isCustom: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    tableName: 'urls',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['shortCode'],
      },
    ],
  });

  return Url;
};