import type{ Request, Response, NextFunction } from 'express';
import { prisma } from './prisma.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

const login = async function(req:Request , res:Response, next: NextFunction) : Promise<Response> {

  const user= await prisma.user.findFirst({
    where: {
      name: req.body.name
    }
  });
  
  if(!user){
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  
  if(!match) {
    
      return res.json({ message: 'Invalid credentials', user: user.name });
    }
  

  const token = jwt.sign(
    { id: user.id,},
      process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

    return res.json({ message: 'Login successful', token: token });
};
const getAllUsers = async function (req:Request , res:Response, next: NextFunction) : Promise<void> {
  
  try { 
    const users = await prisma.user.findUnique({
        where: {
        id: (req as any).user.id
    }
    }
      
    );
    res.json(users);  

  }catch (error) {
    console.error(error);
    res.status(500).json({ error:'User not found!' });
  }
};

const creatUsers = async function (req:Request , res:Response, next: NextFunction) : Promise<void> {

  const saltRounds = 10;

  try {
    
    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const name = req.body.name;
    console.log(name);
    const user= await prisma.user.create({
      data: {
        name:name,
        password:hash
        }
    });
    
    res.json({ message: `User ${user.name} created successfully!` });
  
  }catch (error) {

    console.error(error);
    res.status(500).json({ error: 'This user already exists!' });
  }
};

const putUsers = function (req:Request , res:Response, next: NextFunction) : void {
  prisma.user.update({

  where: {
      id: Number(req.params.id)
  },

  data: {
    name: req.body.name,
    password: req.body.password
  }

  })
};

const DeleteUsers = function (req:Request , res:Response, next: NextFunction) : void {
  prisma.user.delete({

    where: {
        id: Number(req.params.id)
    }
  });
  res.json({ message: 'User deleted successfully' });
};

export { getAllUsers, creatUsers, putUsers, DeleteUsers, login };