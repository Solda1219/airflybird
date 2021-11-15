const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, hashLaravelPassword, verifyPassword, verifyLaravelPassword } = require('../utils/authentication');
const query = require('../utils/sqlQuery');
const setting = require('../../config/setting');
const vehicel_model = require('../model/vehicle')
let loginAgent = async (req, res) => {
  const result = validationResult(req); 
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ message: 'Request is wrong.' });
  }
  try {
    const { username, password } = req.body;
    //check request
    if(!username||!password) return res.status(401).json({message: 'Request is wrong.'})
    //check if username exist
    const r_u_e = await query.get('agents', '*', `Where contact_number='${username}'`);
    if(r_u_e.length == 0) return res.status(401).json({message: 'Phone number is incorrect.'})
    //check status
    const status = r_u_e[0].state;
    if(status==0) return res.status(401).json({message: 'Your account is restricted.'})
    //check if password is correct
    const user = r_u_e[0];
    const u_password = user.password;
    const passwordValid = await verifyLaravelPassword(password, u_password);
    if (passwordValid) {
      const ObjForToken={
        id:user.id, 
        phone:user.contact_number,
        role:'agent',
      };
      const token = createToken(ObjForToken);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const userInfo = user;
      return res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        role:'agent',
        expiresAt
      });
    } else return res.status(401).json({ message: 'Password is incorrect.'});
  } catch (error) {
    return res.status(404).json({
      message: 'Something went wrong.', err: error
    });
  }
};
let loginAdmin = async (req, res) => {
  const result = validationResult(req); 
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ message: 'Request is wrong.' });
  }
  try {
    const { username, password } = req.body;
    let role_str = 'admin';
    if(username==setting.superAdmin) role_str = 'super';
    //check request
    if(!username||!password) return res.status(401).json({message: 'Request is wrong.'})
    //check if username exist
    const r_u_e = await query.get('tb_gpu_user', '*', `Where phone_number='${username}'`);
    if(r_u_e.length == 0) return res.status(401).json({message: 'Phone number is incorrect.'})
    //check status
    const status = r_u_e[0].state;
    if(status==0) return res.status(401).json({message: 'Your account is restricted.'})
    //check if password is correct
    const user = r_u_e[0];
    const u_password = user.password;
    const passwordValid = await verifyLaravelPassword(password, u_password);
    if (passwordValid) {
      const ObjForToken={
        id:user.id, 
        phone:user.phone_number,
        role:role_str,
      };
      const token = createToken(ObjForToken);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const userInfo = user;
      return res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        role:role_str,
        expiresAt
      });
    } else return res.status(401).json({ message: 'Password is incorrect.'});
  } catch (error) {
    return res.status(404).json({
      message: 'Something went wrong.', err: error
    });
  }
};
let loginUser = async (req, res) => {
  const result = validationResult(req); 
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ message: 'Request is wrong.' });
  }
  try {
    const { username, password } = req.body;
    //check request
    if(!username||!password) return res.status(401).json({message: 'Request is wrong.'})
    //check if username exist
    const r_u_e = await query.get('vehicles', '*', `Where phone='${username}'`);
    if(r_u_e.length == 0) return res.status(401).json({message: 'Phone number is incorrect.'})
    //check status
    const status = r_u_e[0].state;
    if(status==0) return res.status(401).json({message: 'Your account is restricted.'})
    //check if password is correct
    const user = r_u_e[0];
    const u_password = user.password;
    const passwordValid = await verifyLaravelPassword(password, u_password);
    if (passwordValid) {
      const ObjForToken={
        id:user.id, 
        phone:user.phone,
        role:'user',
      };
      const token = createToken(ObjForToken);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const userInfo = user;
      return res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        role:'user',
        expiresAt
      });
    } else return res.status(401).json({ message: 'Password is incorrect.'});
  } catch (error) {
    return res.status(404).json({
      message: 'Something went wrong.', err: error
    });
  }
};
let resetPassword = async (req, res) => {
  try {
    const { id,role} = req.user;
    const { old_password, new_password} = req.body;
    let db;
    if(role=='admin'||role=='super')  db='tb_gpu_user';
    else if(role=='agent')  db='agents';
    else if(role=='user')  db='vehicles';
    //check if exist
    const r_u_e = await query.get(`${db}`, '*', `Where id='${id}'`);
    if(r_u_e.length == 0) return res.status(401).json({message: 'Your are not exist.'})  
    const newpassword = await hashPassword(new_password);
    const oldpassword = r_u_e[0].password;
    //confirm password
    const passwordValid = await verifyPassword(old_password, oldpassword);
    if(passwordValid) {
      await query.update(`${db}`, { password: newpassword }, `Where id='${id}'`)
      return res.json({ message: 'success'});
    }else return res.status(401).json({ message: 'Prev password is incorrect.'});
  }
  catch (error) {
    return res.status(404).json({
      message: 'Failed', err: error
    });
  }
}
let getCustomerList = async (req, res) => {
  try {
    const {phone,role}=req.user;
    const item = await vehicel_model.getList(phone,role)
    return res.json({result:item});
  }
  catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.', err: error
    });
  }
}
module.exports = {
  loginAgent,
  loginAdmin,
  loginUser,
  resetPassword,
  getCustomerList,
}
