import { useState } from "react";
import axios from "axios";
function AddReminder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [remindAt, setRemindAt] = useState("");
  const handleSubmit = async(e) => {
    const token = localStorage.getItem("token");
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/reminder", {
        title,
        description,
        remindAt
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("新增提醒失敗:", error);
    }
  };
  return (
    <>
    <form onSubmit={handleSubmit}>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} /> {/* 標題 */}
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} /> {/* 內容 */}
        <input type="text" value={remindAt} onChange={(e) => setRemindAt(e.target.value)} /> {/* 時間 */}
        <button type="submit">新增</button>
    </form>
    </>
  );
}
export default AddReminder;