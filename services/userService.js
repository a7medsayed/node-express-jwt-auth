
const userEntity = require('../models/User');
const bcrypt = require('bcrypt');


const saveUser = async (user) =>{

    const hashedPassword =   await  bcrypt.hash(user.password , 10);

     user = {...user, password: hashedPassword};
   
   return await  userEntity.create(user);
}

const findByEmail = async (email)=>
{
    const user  = await userEntity.findOne({email: email});
    return user;
}
const login = async (user)=>
{
    const savedUser  = await userEntity.findOne({email:user.email});

    if(savedUser)
    {

        const auth =  await bcrypt.compare(user.password , savedUser.password);

        if(auth)
        {
            return savedUser;
        }
        throw Error('incorrect password');
    }
    else
    {
        throw Error('incorrect email');
    }
}

module.exports = {saveUser , login , findByEmail};