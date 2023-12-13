
module.exports = (sequelize,DataTypes) => {
    const Countries = sequelize.define("Countries",{
        country_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        country_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },{timestamps: false});

    Countries.associate = (models) => {
        Countries.hasMany(models.Company,{
            foreignKey : 'country_Id',
            onDelete : 'cascade',
        });
    };

    return Countries;
};