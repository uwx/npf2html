import {snapshotNpf2Html} from './utils';

snapshotNpf2Html('poll', [
  {
    type: 'poll',
    question: 'Do you like me?',
    answers: [{
      client_id: '...',
      answer_text: 'Yeah',
    },
    {
      client_id: '...',
      answer_text: 'Nah',
    }],
    client_id: '...',
    created_at: new Date().toString(),
    timestamp: 1728396261,
    settings: {
      multiple_choice: false,
      close_status: 'closed-after',
      expire_after: 604800,
      source: 'tumblr',
    }
  },
]);
