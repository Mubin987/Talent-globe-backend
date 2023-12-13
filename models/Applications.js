
module.exports = (sequelize,DataTypes) => {
    const Applications = sequelize.define("Applications",{
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
         },
    },);

    Applications.associate = (models) => {
        Applications.belongsTo(models.Jobs, {
            foreignKey: 'job_Id',
            onDelete : 'cascade',
        });
        Applications.belongsTo(models.Employee, {
            foreignKey: 'employee_Id',
            onDelete : 'cascade',
        });
    };

    return Applications;
};