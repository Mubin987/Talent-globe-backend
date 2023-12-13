
module.exports = (sequelize,DataTypes) => {
    const Users = sequelize.define("Users",{
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        usertype: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    Users.associate = (models) => {
        Users.hasOne(models.Company,{
            foreignKey : 'user_Id',
            onDelete : 'cascade',
        });
        Users.hasOne(models.Employee,{
            foreignKey : 'user_Id',
            onDelete : 'cascade',
        });
    };

    return Users;
};