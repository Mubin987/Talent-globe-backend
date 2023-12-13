
module.exports = (sequelize,DataTypes) => {
    const Company = sequelize.define("Company",{
        company_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        industry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{timestamps: false});

    Company.associate = (models) => {
        Company.belongsTo(models.Countries, {
            foreignKey: 'country_Id',
            onDelete : 'cascade',
        });
        Company.belongsTo(models.Users, {
            foreignKey: 'user_Id',
            onDelete : 'cascade',
        });
        Company.hasMany(models.Jobs,{
            foreignKey : 'company_Id',
            onDelete : 'cascade',
        });
    };

    return Company;
};