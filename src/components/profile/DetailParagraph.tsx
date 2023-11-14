interface Props {
  title: string
  detail?: string | number | null
  fallbackText: string
}

const DetailParagraph = ({ title, detail, fallbackText }: Props) => {
  return (
    <p className="font-semibold">{title}: <span className="text-muted-foreground font-medium">{detail || fallbackText}</span></p>
  )
}

export default DetailParagraph
