import axiosClient from "../../utils/axios_client";
import { IInstructor } from "../../utils/interfaces";

export type QuestionnaireType =
  | "Metareview"
  | "Author Feedback"
  | "Teammate Review"
  | "Survey"
  | "Assignment Survey"
  | "Global Survey"
  | "Course Survey"
  | "Bookmark Rating"
  | "Quiz";


export const QuestionnaireTypes: QuestionnaireType[] = [
  "Metareview",
  "Author Feedback",
  "Teammate Review",
  "Survey",
  "Assignment Survey",
  "Global Survey",
  "Course Survey",
  "Bookmark Rating",
  "Quiz",
];


export interface IItem {
  id?: number;
  txt: string;
  weight: number;
  seq: number;
  question_type: string;
  size: number;
  alternatives: string;
  min_label: number;
  max_label: number;
  break_before: number;
  questionnaire_id?: number;
  _destroy?: boolean;
}


export interface QuestionnaireFormValues {
  id?: number;
  name: string;
  questionnaire_type:string;
  private:boolean;
  min_question_score: number;
  max_question_score: number;
  instructor_id?: number;
  instructor?: IInstructor;
  items?: IItem[];
}

export interface QuestionnaireResponse {
  id?: number;
  name: string;
  private:boolean;
  questionnaire_type:string;
  min_question_score: number;
  max_question_score: number;
  instructor_id: number;
  instructor: IInstructor;
  items?: IItem[];
}

export interface QuestionnaireRequest {
  id?: number;
  name: string;
  private:boolean;
  questionnaire_type:string;
  min_question_score: number;
  max_question_score: number;
  instructor_id?: number;
  instructor?: IInstructor;
  items_attributes: IItem[];
}

export function getQuestionnaireTypes(quest: QuestionnaireResponse[]): string[] {
  return Array.from(
    new Set(
      quest
        .map((q) => q.questionnaire_type)
        .filter((type): type is string => type !== null)
    )
  );
}


export const transformQuestionnaireRequest = (values: QuestionnaireFormValues) => {
  const questionnaire: QuestionnaireRequest = {
    name: values.name,
    questionnaire_type:values.questionnaire_type,
    private:values.private,
    min_question_score: values.min_question_score,
    max_question_score:values.max_question_score,
    instructor_id:values.instructor_id,
    instructor:values.instructor,
    items_attributes:values.items ? values.items : [],
  };
  console.log("Transformed Questionnaire Request:", questionnaire);
  return JSON.stringify(questionnaire);
};

export const transformQuestionnaireResponse = (questionnaireResponse: string) => {
  const questionnaire: QuestionnaireResponse = JSON.parse(questionnaireResponse);
  const questionnaireValues: QuestionnaireFormValues = {
    id: questionnaire.id,
    name: questionnaire.name,
    private:questionnaire.private,
    questionnaire_type:questionnaire.questionnaire_type,
    min_question_score: questionnaire.min_question_score,
    max_question_score:questionnaire.max_question_score,
    instructor_id:questionnaire.instructor_id,
    instructor:questionnaire.instructor,
    items:questionnaire.items,
  };
  return questionnaireValues;
};

export async function loadQuestionnaire({ params }: any) {
  let questionnaireData = {};
  // if params contains id, then we are editing a user, so we need to load the user data
  if (params.id) {
    const questionnaireResponse = await axiosClient.get(`/questionnaires/${params.id}`, {
      transformResponse: transformQuestionnaireResponse,
    });
    questionnaireData = await questionnaireResponse.data;
  }
  else {
    // Fetch all questionnaires
    const questionnaireResponse = await axiosClient.get(`/questionnaires`);
    questionnaireData = questionnaireResponse.data.map((q: any) =>
      transformQuestionnaireResponse(JSON.stringify(q))
    );
  }

  console.log(questionnaireData);
  return questionnaireData;
}

