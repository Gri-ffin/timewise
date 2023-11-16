import { BsGithub, BsQuestionLg } from 'react-icons/bs'
import { Folder, Star, File, Flag, Power, X } from 'lucide-react'

export const getIcon = (type: string) => {
  switch (type) {
    case 'github':
      return BsGithub

    default:
      return BsQuestionLg;
  }
}

export const getGroupIcon = (iconName: string) => {
  switch (iconName) {
    case 'Folder':
      return Folder
    case 'Star':
      return Star
    case 'File':
      return File
    case 'Flag':
      return Flag
    case 'Power':
      return Power
    default:
      return X
  }
}
