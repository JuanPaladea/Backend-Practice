import { Router } from "express";
import messagesManagerDB from "../dao/utils/messageManagerDB.js";

const router = Router();

const messagesManagerService = new messagesManagerDB()

router.get('/', async (req, res) => {
  const chat = await messagesManagerService.getMessages({})
  console.log(chat)
  res.render(
    "chat",
    {
      style: 'index.css',
      layout: 'main',
      chat: chat
    }
  )
})

router.post('/', async (req, res) => {
  const {user, message} = req.body
  try {
    await messagesManagerService.addMessage(user, message)
  } catch (error) {
    console.error(error)
  }
  res.send({status:'success', message:'mensaje agregado'});  
})

export default router