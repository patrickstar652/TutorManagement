import React from 'react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function Reminder() {
  const { scheduleId } = useParams(); // 從路由參數取得 scheduleId
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [remind_at, setRemindAt] = useState('');
  const [remind_date, setRemindDate] = useState('');
  
  const fetchData = async () => {
    try{
      const res = await axios.get ('http://localhost:3000/reminder', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setTitle(res.data.title);
      setDescription(res.data.description);
      setRemindAt(res.data.remind_at);
      setRemindDate(res.data.remind_date);

    }catch (error) {
      console.error("取得提醒失敗：", error);
    }
  }
  return (
    <div>Reminder</div>
  )
}
export default Reminder;