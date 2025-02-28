export interface QuestionTemplateProps {
  question: any; 
  selectedQuestion: number;
  handleQuestionChange: (val: any) => void;
  questions: any[]; 
  questionItem: any; 
}