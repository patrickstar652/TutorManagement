import React from 'react'

function AddPayment() {
  const fetchData = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/payment`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }  
  return (
    <div>AddPayment</div>
  )
}
export default AddPayment