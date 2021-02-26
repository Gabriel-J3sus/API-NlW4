import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { AppError } from '../errors/AppError';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';

class AnswerController {

  //http://localhost:3333/answers/5?u=3fd9520a-977c-4778-ac40-94ba3b3e14f9

  async execute(request: Request, response: Response) {
    const { value } = request.params;
    const { u } = request.query;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({id: String(u)});

    if (!surveyUser) {
      throw new AppError("Survey User does not exists!")

      // return response.status(400).json({error: "Survey User does not exists"});
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);
  }
}

export { AnswerController }
