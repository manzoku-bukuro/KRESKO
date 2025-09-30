import { useReview } from './hooks/useReview'
import { ReviewView } from './Review.view'

export const Review = () => {
  const props = useReview()
  return <ReviewView {...props} />
}