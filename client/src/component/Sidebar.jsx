
import { useParams } from "react-router-dom";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import { useMemo, useState } from "react";
import AddReminder from "./AddReminder";
import { useClasses } from "../hooks/useClasses";
import { useReminders } from "../hooks/useReminders";

function Sidebar() {
	const { scheduleId } = useParams(); // 從路由參數取得
	const [showReminder, setShowReminder] = useState(false);
	const [showPayment, setShowPayment] = useState(false);
	const { classes } = useClasses();
	const { addReminder } = useReminders(scheduleId);

	const courseName = useMemo(() => {
		const course = classes.find((item) => item.schedule_id == scheduleId);
		return course?.course_name || "";
	}, [classes, scheduleId]);

	const handleCreateReminder = async (reminder) => {
		await addReminder(reminder);
		setShowReminder(false);
	};

	return (
		<>
			<div className="fixed left-4 top-24 h-auto bg-white/95 shadow-[0_18px_44px_-32px_rgba(15,35,65,0.38)] rounded-2xl z-20 border border-slate-200 backdrop-blur">
				<nav className="py-3 px-2">
					<button
						onClick={() => setShowReminder(!showReminder)}
						className={`flex flex-col items-center py-3 px-3 mb-2 rounded-lg transition-all duration-300 group ${
							showReminder 
								? "bg-[#12345c] text-white shadow-lg transform scale-105" 
								: "text-slate-600 hover:bg-slate-100 hover:text-[#12345c] hover:scale-105"
						}`}
					>
						<FaUsers className={`text-lg mb-1 ${showReminder ? "text-white" : "group-hover:text-[#12345c]"}`} />
						<span className="text-xs font-medium whitespace-nowrap">提醒事項</span>
					</button>
					
					<button
						onClick={() => setShowPayment(!showPayment)}
						className={`flex flex-col items-center py-3 px-3 mb-2 rounded-lg transition-all duration-300 group ${
							showPayment 
								? "bg-[#12345c] text-white shadow-lg transform scale-105" 
								: "text-slate-600 hover:bg-slate-100 hover:text-[#12345c] hover:scale-105"
						}`}
					>
						<FaCalendarAlt className={`text-lg mb-1 ${showPayment ? "text-white" : "group-hover:text-[#12345c]"}`} />
						<span className="text-xs font-medium whitespace-nowrap">繳費資訊</span>
					</button>
				</nav>
			</div>

			{showReminder && (
				<AddReminder 
					onClose={() => setShowReminder(false)}
					onCreate={handleCreateReminder}
					scheduleId={scheduleId}
					courseName={courseName}
				/>
			)}

			{showPayment && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
					<div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-800">繳費內容</h2>
							<button 
								onClick={() => setShowPayment(false)}
								className="text-gray-500 hover:text-gray-700 text-xl"
							>
								✕
							</button>
						</div>
						<div className="space-y-4">
							<p className="text-gray-600">這裡是繳費狀態表單內容...</p>
							{/* 在這裡添加繳費狀態表單內容 */}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
export default Sidebar;
