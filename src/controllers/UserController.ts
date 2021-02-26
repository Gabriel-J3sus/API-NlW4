import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

import { UsersRepository } from '../repositories/UsersRepository';

class UserController {
  async create(request: Request, response: Response) {
    const { name, email } = request.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required(),
    })

    // if (!await schema.isValid(request.body)) {
    //   return response.status(400).json({ error: "Validatiom failed" });
    // }

    try {
      await  schema.validate(request.body, { abortEarly: false })
    } catch (err) {
      throw new AppError(err);

      // return response.status(400).json({ error: err })
    }

    const usersRepository = getCustomRepository(UsersRepository);

    const userAlreadyExists = await usersRepository.findOne({ email })

    if (userAlreadyExists) {
      throw new AppError("User already exists");

      // return response.status(400).json({ error: "User already exists!" });
    }

    const user = usersRepository.create({ name, email });

    await usersRepository.save(user);

    return response.status(201).json(user);
  }
}

export { UserController };
