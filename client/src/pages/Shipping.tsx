import { ChangeEvent, FormEvent, useState } from 'react'
import { BiArrowBack } from 'react-icons/bi'
import { FaBackward } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const Shipping = () => {
  const [shippingDetails, setShippingDetails] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: undefined,
  })

  const navigate = useNavigate()

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(shippingDetails)
  }

  return (
    <div className="shipping">
      <div className="back">
        <button onClick={() => navigate('/cart')}>
          <BiArrowBack />
        </button>
      </div>

      <div className="shipping-details">
        <h1>Shipping Address</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingDetails.address}
            onChange={changeHandler}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingDetails.city}
            onChange={changeHandler}
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingDetails.state}
            onChange={changeHandler}
          />
          <select
            title="Select Country"
            name="country"
            value={shippingDetails.country}
            onChange={changeHandler}
          >
            <option value="">Select Country</option>
            <option value="india">India</option>
            <option value="bangladesh">Bangladesh</option>
            <option value="nepal">Nepal</option>
          </select>
          <input
            type="number"
            name="pincode"
            placeholder="Pincode"
            value={shippingDetails.pincode}
            onChange={changeHandler}
          />
          <button>Continue to Payment</button>
        </form>
      </div>
    </div>
  )
}

export default Shipping
