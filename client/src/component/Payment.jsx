import { useState } from 'react';
function Payment() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [paytime, setPaytime] = useState("");
  return (
    <div>
      <h2>Payment Status</h2>
      {/* 在這裡顯示付款狀態的內容 */}
    </div>
  );
}

export default Payment;
