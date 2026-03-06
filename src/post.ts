import type{ Request, Response, NextFunction } from 'express';
import { prisma } from './prisma.js';

const getAllPost = async function (req:Request , res:Response, next: NextFunction) : Promise<void> {
  
  try { 
    const post = await prisma.post.findMany({
        where: {
        authorId: (req as any).user.id
    }
      
  });
    res.json(post);  

  }catch (error) {
    console.error(error);
    res.status(500).json({ error:'Post not found!' });
  }
};

const creatPost = async function (req:Request , res:Response, next: NextFunction) : Promise<void> {

  try {

    const { content } = req.body;
    const post= await prisma.post.create({
        data: {
          content: content,
          authorId: (req as any).user.id
        }
    });

    res.json({ message: `Post ${post.content} created successfully!` });
  
  }catch (error) {

    console.error(error);
    res.status(500).json({ error: 'This post already exists!' });
  }
};

const putPost = function (req:Request , res:Response, next: NextFunction) : void {
  prisma.post.update({

  where: {
      id: Number(req.params.id)
  },

  data: {
    content: req.body.content
  }
  
  })
  res.json({ message: 'Post updated successfully' });
};

const DeletePost = function (req:Request , res:Response, next: NextFunction) : void {
  prisma.post.delete({

    where: {
        id: Number(req.params.id)
    }
  });
  res.json({ message: 'Post deleted successfully' });
};

export { getAllPost, creatPost, putPost, DeletePost };