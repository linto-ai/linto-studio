const LIGHT_CONVERSATION_PROJECTION = {
  text: 0,
  speakers: 0,
  keywords: 0,
  highlights: 0,
}

const LIST_CONVERSATION_PROJECTION = {
  page: 0,
  text: 0,
  "jobs.transcription.job_logs": 0,
}

const USER_PUBLIC_PROJECTION = {
  email: 1,
  firstname: 1,
  lastname: 1,
  img: 1,
  private: 1,
}

const USER_PERSONAL_PROJECTION = {
  salt: 0,
  passwordHash: 0,
  keyToken: 0,
  authLink: 0,
}

const USER_FAVORITES_PROJECTION = { favorites: 1 }

const ORGANIZATION_PUBLIC_PROJECTION = { token: 0 }

module.exports = {
  LIGHT_CONVERSATION_PROJECTION,
  LIST_CONVERSATION_PROJECTION,
  USER_PUBLIC_PROJECTION,
  USER_PERSONAL_PROJECTION,
  USER_FAVORITES_PROJECTION,
  ORGANIZATION_PUBLIC_PROJECTION,
}
