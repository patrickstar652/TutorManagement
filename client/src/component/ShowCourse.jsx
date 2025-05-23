import { useState } from "react";
import axios from "axios";
function ShowCourse() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-orange-400 to-orange-500 text-white">
              <tr>
                <th className="py-4 px-6 text-left font-semibold"></th>
                <th className="py-4 px-6 text-center font-semibold">星期一</th>
                <th className="py-4 px-6 text-center font-semibold">星期二</th>
                <th className="py-4 px-6 text-center font-semibold">星期三</th>
                <th className="py-4 px-6 text-center font-semibold">星期四</th>
                <th className="py-4 px-6 text-center font-semibold">星期五</th>
                <th className="py-4 px-6 text-center font-semibold">星期六</th>
                <th className="py-4 px-6 text-center font-semibold">星期日</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                <td className="py-4 px-6 bg-gray-50 font-medium">
                  09:00~12:00
                </td>
                <td className="py-4 px-6 text-center">國二數學</td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
              </tr>
              <tr className="hover:bg-blue-50 transition-colors">
                <td className="py-4 px-6 bg-gray-50 font-medium">
                  14:00~17:00
                </td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
                <td className="py-4 px-6 text-center"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default ShowCourse;
