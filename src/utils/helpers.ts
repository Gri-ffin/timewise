import { BsGithub, BsQuestionLg } from 'react-icons/bs'

export const getIcon = (type: string) => {
  switch (type) {
    case 'github':
      return BsGithub

    default:
      return BsQuestionLg;
  }
}
