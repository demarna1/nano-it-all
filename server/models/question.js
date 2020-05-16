'use strict';
module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define('Question', {
    question: DataTypes.STRING,
    rightanswers: DataTypes.STRING,
    wronganswers: DataTypes.STRING,
    round: DataTypes.INTEGER,
    asked: DataTypes.BOOLEAN
  }, {});
  Question.associate = function(models) {
    // associations can be defined here
  };
  return Question;
};