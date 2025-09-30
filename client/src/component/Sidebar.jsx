
import { useLocation, useNavigate } from "react-router-dom";
import { FaUsers, FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import AddReminder from "./AddReminder";

function Sidebar() {
	const location = useLocation();
	const navigate = useNavigate();
	const [showReminder, setShowReminder] = useState(false);
	const [showPayment, setShowPayment] = useState(false);

	return (
		<>
			<div className="fixed left-4 top-24 h-auto bg-white shadow-2xl rounded-2xl z-20 border border-gray-200">
				<nav className="py-3 px-2">
					<button
						onClick={() => setShowReminder(!showReminder)}
						className={`flex flex-col items-center py-3 px-3 mb-2 rounded-lg transition-all duration-300 group ${
							showReminder 
								? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg transform scale-105" 
								: "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:scale-105"
						}`}
					>
						<FaUsers className={`text-lg mb-1 ${showReminder ? "text-white" : "group-hover:text-orange-600"}`} />
						<span className="text-xs font-medium whitespace-nowrap">提醒事項</span>
					</button>
					
					<button
						onClick={() => setShowPayment(!showPayment)}
						className={`flex flex-col items-center py-3 px-3 mb-2 rounded-lg transition-all duration-300 group ${
							showPayment 
								? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg transform scale-105" 
								: "text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:scale-105"
						}`}
					>
						<FaCalendarAlt className={`text-lg mb-1 ${showPayment ? "text-white" : "group-hover:text-orange-600"}`} />
						<span className="text-xs font-medium whitespace-nowrap">繳費狀態</span>
					</button>
				</nav>
			</div>

			{showReminder && (
				<AddReminder onClose={() => setShowReminder(false)} />
			)}

			{showPayment && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
					<div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
						<div className="flex justify-between items-center mb-4">
							<h2 className="text-xl font-bold text-gray-800">繳費狀態</h2>
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