import Navbar from "../component/Navbar";

function Course() {
  return (
    <>
      <Navbar />
      <h2 className="text-center text-2xl font-bold my-6">課表</h2>
      <div className="flex justify-center p-4">
        <table className="w-4/5 border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="border px-4 py-3"></th>
              <th className="border px-4 py-3">星期一</th>
              <th className="border px-4 py-3">星期二</th>
              <th className="border px-4 py-3">星期三</th>
              <th className="border px-4 py-3">星期四</th>
              <th className="border px-4 py-3">星期五</th>
              <th className="border px-4 py-3">星期六</th>
              <th className="border px-4 py-3">星期日</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50">
              <td className="border px-4 py-3 bg-gray-100 font-medium">9:00~12:00</td>
              <td className="border px-4 py-3">國二數學</td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="border px-4 py-3 bg-gray-100 font-medium">14:00~17:00</td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
              <td className="border px-4 py-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-center">編輯</p>
      <div className="w-1/3 h-1/3 ">
        課程<input type="text"/>
      </div>
    </>
  );
}
export default Course;
