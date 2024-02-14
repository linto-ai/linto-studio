const PERSON = {
  type: "object",
  name: "person",
  title: "Person",
  title_en: "Person",
  title_fr: "Personne",
  description: "A person",
  description_en: "A person",
  description_fr: "Une personne",
  properties: {
    name: {
      type: "string",
      title: "Name",
      title_en: "Name",
      title_fr: "Nom",
      description: "The name of the person",
      description_en: "The name of the person",
      description_fr: "Le nom de la personne",
    },
    birthDate: {
      type: "string",
      title: "Birth date",
      title_en: "Birth date",
      title_fr: "Date de naissance",
      description: "The birth date of the person",
      description_en: "The birth date of the person",
      description_fr: "La date de naissance de la personne",
    },
    deathDate: {
      type: "string",
      title: "Death date",
      title_en: "Death date",
      title_fr: "Date de décès",
      description: "The death date of the person",
      description_en: "The death date of the person",
      description_fr: "La date de décès de la personne",
    },
  },
}

const COMMENT = {
  type: "object",
  name: "comment",
  title: "Comment",
  title_en: "Comment",
  title_fr: "Commentaire",
  description: "A comment",
  description_en: "A comment",
  description_fr: "Un commentaire",
  properties: {
    content: {
      type: "string",
      title: "Content",
      title_en: "Content",
      title_fr: "Contenu",
      description: "The content of the comment",
      description_en: "The content of the comment",
      description_fr: "Le contenu du commentaire",
    },
  },
  required: ["content"],
}

const METADATAS = [PERSON, COMMENT]

export default METADATAS
