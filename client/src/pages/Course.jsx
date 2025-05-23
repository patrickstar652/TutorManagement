import AddCourse from "../component/AddCourse";
import Navbar from "../component/Navbar";
import ShowCourse from "../component/ShowCourse";
function Course() {
  const popup = () => {
    document.querySelector(".popupWindow").classList.remove("hidden");
  };
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative flex flex-col items-center mb-12">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent mb-4">
              課程時間表
            </h1>
            <div className="h-1.5 w-40 bg-gradient-to-r from-orange-500 to-orange-300 rounded-full"></div>
          </div>
          <button
            onClick={popup}
            className="absolute right-0 top-0 inline-flex items-center px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition-all duration-200 gap-2 shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            編輯課程
          </button>
        </div>
      </div>
      <ShowCourse />
      <AddCourse />
    </div>
  );
}
export default Course;
