import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { resolve } from 'path';
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { AppError } from "../errors/AppError";

interface VariablesProps {
  name: string;
  title: string;
  description: string;
  id: string;
  link: string;
}

class SendMailController {
  async execute(request: Request, response: Response) {
    const { email, survey_id } = request.body;

    const usersRepository = getCustomRepository(UsersRepository);
    const surveysRepository = getCustomRepository(SurveysRepository);
    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const user = await usersRepository.findOne({ email });

    if (!user) {
      throw new AppError("User does not exists!")

      // return response.status(400).json({ error: "User does not exists!" });
    }

    const survey = await surveysRepository.findOne({ id: survey_id });

    if (!survey) {
      throw new AppError("Survey User does not exists!")

      // return response.status(400).json({ error: "Survey does not exists!" });
    }


    const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

    const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
      where: {user_id: user.id, value: null}, //or === [{}, {}] and === { , }
      relations: ["user", "survey"]
    });

    const variables: VariablesProps = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL,
    }

    if (surveyUserAlreadyExists) {
      variables.id = surveyUserAlreadyExists.id;
      await SendMailService.execute({
        to: email,
        subject: survey.title,
        variables,
        path: npsPath,
      })

      return response.json(surveyUserAlreadyExists);
    }

    //Salvar informações na tabela
    const surveyUser = surveysUsersRepository.create({
      user_id: user.id,
      survey_id
    });

    await surveysUsersRepository.save(surveyUser);

    //Enviar email para o usuario
    variables.id = surveyUser.id;

    await SendMailService.execute({
      to: email,
      subject: survey.title,
      variables,
      path: npsPath,
    });

    return response.json(surveyUser);
  }
}

export { SendMailController };
