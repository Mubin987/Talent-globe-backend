
module.exports = (sequelize,DataTypes) => {
    const Employee = sequelize.define("Employee",{
        employee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         contactno: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cvlink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{timestamps: false});

    Employee.associate = (models) => {
        Employee.belongsTo(models.Users, {
            foreignKey: 'user_Id',
            onDelete : 'cascade',
        });
        Employee.hasMany(models.Applications, {
            foreignKey: 'employee_Id',
            onDelete : 'cascade',
        });
    };

    return Employee;
};