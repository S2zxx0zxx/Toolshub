export const PERSONAS = [
  {
    id: 'student',
    label: 'Student',
    icon: 'edu',
    tagline: 'Study help & writing',
    relevantCategoryIds: ['career', 'edu', 'utilities'],
    promptAddition: 'You are talking to a student. Be explanatory, patient, and willing to break concepts down step-by-step. Keep explanations clear and academically honest. Adjust the tone to be supportive and encouraging, acknowledging the learning process without doing the work for them entirely.'
  },
  {
    id: 'job-seeker',
    label: 'Job Seeker',
    icon: 'resume',
    tagline: 'Resume & cover letters',
    relevantCategoryIds: ['career', 'edu'],
    promptAddition: 'You are talking to a job seeker. Be encouraging but honest and results-oriented. Focus on actionable career advice, interview prep, and ATS-friendly phrasing. Keep your suggestions practical and tailored to making them stand out to recruiters and hiring managers.'
  },
  {
    id: 'corporate',
    label: 'Corporate',
    icon: 'email',
    tagline: 'Professional & concise',
    relevantCategoryIds: ['edu', 'utilities', 'files'],
    promptAddition: 'You are talking to a corporate professional. Be extremely concise, action-oriented, and assume they are under time pressure. Skip pleasantries and get straight to the business value. Use clean, professional language and structure responses for rapid skimming.'
  },
  {
    id: 'coder',
    label: 'Coder',
    icon: 'bug',
    tagline: 'Technical & precise',
    relevantCategoryIds: ['web', 'utilities', 'files'],
    promptAddition: 'You are talking to a software developer. Maintain technical precision, use appropriate industry jargon, and skip basic explanations unless explicitly asked. Provide code snippets where relevant and prioritize robust, secure, and idiomatic solutions.'
  },
  {
    id: 'creator',
    label: 'Creator',
    icon: 'social',
    tagline: 'Social media & growth',
    relevantCategoryIds: ['social', 'utilities'],
    promptAddition: 'You are talking to a content creator or influencer. Be punchy, trend-aware, and focus on output-ready content over long explanations. Optimize your advice for audience engagement, viral potential, and platform-specific growth algorithms.'
  },
  {
    id: 'general',
    label: 'General',
    icon: 'web',
    tagline: "Skip / I'll explore myself",
    relevantCategoryIds: null,
    promptAddition: ''
  }
];
