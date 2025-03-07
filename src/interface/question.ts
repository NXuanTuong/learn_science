export interface QuestionTemplateProps {
  question: any;
  selectedQuestion: number;
  questionId: String;
  handleQuestionChange: (val: any) => void;
  questions: any[];
  questionItem: any;
}
