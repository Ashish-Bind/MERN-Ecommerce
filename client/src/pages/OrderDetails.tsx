import { useParams } from 'react-router-dom'

const OrderDetails = () => {
  const { id } = useParams()

  return <div>OrderDetails - {id}</div>
}

export default OrderDetails
