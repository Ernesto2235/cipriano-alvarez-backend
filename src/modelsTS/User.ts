
import  { DataTypes,Model,Sequelize, InferAttributes,InferCreationAttributes }  from '@sequelize/core';
import { Attribute,PrimaryKey,AutoIncrement,NotNull,Table } from '@sequelize/core/decorators-legacy';





@Table({ tableName: 'Users' }) // Specify the table name if different
export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>>  {

    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    @NotNull
    declare id: number;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare email: string;

    @Attribute(DataTypes.STRING)
    @NotNull
    declare password: string;

    // Additional methods can be added here for user-related operations
}



export async function createUser(email:string, password:string) {
    try{
        const  newUser  = await User.build({email: email, password: password});
        await newUser.save();

        return newUser;
    }catch(error){
        return error
    }

}
export async function getUserByEmail(email: string) {
    try{
        const user = await User.findOne({ where: { email } });

        return user;
    }catch(error){
        return error
    }

}
export async function deleteUserByEmail(email: string){
    try{
        const result = await User.destroy({where:{email:email}})
        return result
    }catch(error){
        return error
    }


}