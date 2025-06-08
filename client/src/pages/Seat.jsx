import { useState } from "react";
import Navbar from "../component/Navbar";
function Seat() {
  // 定義桌子格式
  const cols = 2; // 2行
  const rowsPerCol = 5; // 每行5列
  const seatsPerDesk = 3; // 每張桌子3個位置

  // 模擬一些學生名字資料（實際應用中可能從資料庫取得）
  const sampleNames = [
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "盧柏宇",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  // 座位狀態: 預設所有座位都是可用的，並隨機分配名字
  // 三維陣列: [col][row][seat] = { status, name }
  const [seats, setSeats] = useState(
    // 行 列
    // 建立長度為2、5、3的陣列
    // .fill () 用undefined填充
    // map 為每個元素再建立一層資料
    Array(cols)
      .fill()
      .map((_, colIndex) =>
        Array(rowsPerCol)
          .fill()
          .map((_, rowIndex) => {
            // 計算當前位置（行列組合）的第一個座位在整個教室中的索引
            const baseIndex = (colIndex * rowsPerCol + rowIndex) * seatsPerDesk;
            return Array(seatsPerDesk)
              .fill()
              .map((_, seatIndex) => {
                // 計算當前座位在整個教室的線性索引
                const nameIndex = baseIndex + seatIndex;
                const name =
                  nameIndex < sampleNames.length ? sampleNames[nameIndex] : "";
                return {
                  status: name ? 1 : 0, // 有名字的座位預設為已占用
                  name: name,
                };
              });
          })
      )
  );

  // 點擊座位時的處理函數
  const handleSeatClick = (col, row, seat) => {
    const newSeats = JSON.parse(JSON.stringify(seats)); // 深度複製
    // 0 -> 1 -> 2 -> 0 循環切換狀態 (可用 -> 已占用 -> 不可用 -> 可用)
    newSeats[col][row][seat].status = (newSeats[col][row][seat].status + 1) % 3;
    setSeats(newSeats);
  };

  return (
        <>
            <Navbar />
            <div className="flex flex-col items-center mt-6">
                <h1 className="text-center text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">班級狀況</h1>
                <div className="h-1.5 w-40 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full mt-1"></div>
            </div>

            <div className="max-w-6xl mx-auto my-12 px-4">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 text-blue-800">教室座位表</h2>
                    
                    {/* 螢幕區域 */}
                    <div className="w-3/5 h-12 mx-auto mb-12 rounded-lg bg-gradient-to-r from-blue-400 to-blue-500 text-center text-white flex items-center justify-center shadow-md">
                        講台
                    </div>
                    
                    {/* 座位區域 - 影廳風格 */}
                    <div className="max-w-4xl mx-auto mb-8">
                        {Array.from({ length: rowsPerCol }).map((_, rowIndex) => (
                            <div key={`row-${rowIndex}`} className="flex justify-center mb-5 gap-16">
                                {Array.from({ length: cols }).map((_, colIndex) => (
                                    <div 
                                        key={`desk-${colIndex}-${rowIndex}`} 
                                        className="flex gap-1"
                                    >
                                        {Array.from({ length: seatsPerDesk }).map((_, seatIndex) => {
                                            const seatData = seats[colIndex][rowIndex][seatIndex];
                                            return (
                                                <div 
                                                    key={`seat-${colIndex}-${rowIndex}-${seatIndex}`}
                                                    onClick={() => handleSeatClick(colIndex, rowIndex, seatIndex)}
                                                    className={`w-16 h-14 flex flex-col items-center justify-center cursor-pointer rounded-t-xl transition-all duration-300 ${
                                                        seatData.status === 0 
                                                            ? 'bg-gray-200 hover:bg-gray-300' 
                                                            : seatData.status === 1 
                                                                ? 'bg-blue-400 text-white hover:bg-blue-500' 
                                                                : 'bg-gray-400 text-gray-200 hover:bg-gray-500'
                                                    }`}
                                                >
                                                    <div className="text-sm font-medium overflow-hidden whitespace-nowrap overflow-ellipsis w-full text-center px-1">
                                                        {seatData.name || "-"}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    
                    {/* 圖例說明 */}
                    <div className="flex justify-center gap-6 mt-12">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-t-xl bg-gray-200"></div>
                            <span>可用座位</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-t-xl bg-blue-400"></div>
                            <span>已占用</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-t-xl bg-gray-400"></div>
                            <span>不可用</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Seat;