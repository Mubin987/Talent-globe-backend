
module.exports = (sequelize,DataTypes) => {
    const Jobs = sequelize.define("Jobs",{
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
         },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Jobs.associate = (models) => {
        Jobs.belongsTo(models.Company, {
          foreignKey: 'company_Id',
          onDelete : 'cascade',
        });
        Jobs.hasMany(models.Applications, {
            foreignKey: 'job_Id',
            onDelete : 'cascade',
        });
    };

    return Jobs;
};