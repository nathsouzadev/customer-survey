export const fakeSurvey = {
  id: 'survey',
  name: 'Exampled Survey',
  title: 'Customer Experience',
  questions: [
    {
      id: 'question',
      surveyId: 'survey',
      question: 'Como você avalia o nosso atendimento?',
      answers: [
        { id: 'a', questionId: 'question', answer: '1', label: 'bom' },
        { id: 'b', questionId: 'question', answer: '1', label: 'bom' },
        { id: 'c', questionId: 'question', answer: '1', label: 'bom' },
        { id: 'd', questionId: 'question', answer: '2', label: 'regular' },
        { id: 'e', questionId: 'question', answer: '2', label: 'regular' },
        { id: 'f', questionId: 'question', answer: '3', label: 'ruim' },
      ],
    },
    {
      id: 'question-b',
      surveyId: 'survey',
      question: 'Você agendou um novo atendimento?',
      answers: [
        { id: 'a', questionId: 'question-b', answer: '1', label: 'bom' },
        { id: 'b', questionId: 'question-b', answer: '1', label: 'bom' },
        { id: 'c', questionId: 'question-b', answer: '1', label: 'bom' },
        { id: 'd', questionId: 'question-b', answer: '2', label: 'regular' },
        { id: 'e', questionId: 'question-b', answer: '2', label: 'regular' },
        { id: 'f', questionId: 'question-b', answer: '3', label: 'ruim' },
      ],
    },
  ],
};
