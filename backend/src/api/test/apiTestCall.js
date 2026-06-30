import { Router } from 'express'

export const testRouter = Router()

testRouter.get('/', (req, res) => {
  res.json({ message: "The backend server is alive and receiving requests!" });
});