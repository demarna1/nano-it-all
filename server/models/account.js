'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    address: DataTypes.STRING,
    name: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    password: DataTypes.STRING,
    sid: DataTypes.STRING,
    token: DataTypes.STRING
  }, {});
  Account.associate = function(models) {
    // associations can be defined here
  };
  return Account;
};