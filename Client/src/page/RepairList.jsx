import React, { useState, useEffect } from "react";
import Header from "../components/header";
import { repairAPI } from "../services/api";
import moveBG from "../assets/bg.png";

export default function RepairListPage() {
  const [repairs, setRepairs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // ดึงข้อมูลแจ้งซ่อมของผู้ใช้
  useEffect(() => {
    fetchRepairs();
  }, []);

  const fetchRepairs = async () => {
    try {
      setIsLoading(true);
      const response = await repairAPI.getAllRepairs();

      if (response.success) {
        setRepairs(response.data);
        setMessage("");
      } else {
        setMessage(response.message || "ไม่สามารถดึงข้อมูลได้");
        setMessageType("error");
      }
    } catch (error) {
      console.error("Error fetching repairs:", error);
      const errorMsg =
        error?.message || "เกิดข้อผิดพลาดในการดึงข้อมูล";
      setMessage(errorMsg);
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (repairId) => {
    if (window.confirm("คุณแน่ใจว่าต้องการลบการแจ้งซ่อมนี้หรือไม่?")) {
      try {
        const response = await repairAPI.deleteRepair(repairId);

        if (response.success) {
          setMessage("ลบข้อมูลแจ้งซ่อมเรียบร้อยแล้ว");
          setMessageType("success");
          fetchRepairs();
        } else {
          setMessage(response.message || "ไม่สามารถลบได้");
          setMessageType("error");
        }
      } catch (error) {
        setMessage("เกิดข้อผิดพลาดในการลบ");
        setMessageType("error");
      }
    }
  };

  return (
    <div
      className="min-h-screen font-['Kanit',sans-serif] bg-[#FDF6ED]"
      style={{
        backgroundImage: `url(${moveBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        position: "relative",
      }}
    >
      <Header />
      <div className="fixed inset-0 bg-white/45 pointer-events-none"></div>

      <main className="relative pt-32 sm:pt-36 md:pt-40 lg:pt-52 xl:pt-36 pb-12 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto w-full">
          {/* Alert Messages */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg text-white font-semibold ${
                messageType === "success"
                  ? "bg-green-500 shadow-lg"
                  : "bg-red-500 shadow-lg"
              }`}
            >
              {message}
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#F3D9B0] rounded-full p-4 sm:p-5 shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-[#4E2E16]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#4E2E16]">
                รายการแจ้งซ่อม
              </h1>
            </div>
            <button
              onClick={fetchRepairs}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isLoading ? "กำลังโหลด..." : "รีเฟรช"}
            </button>
          </div>

          {/* Repairs List */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">กำลังโหลดข้อมูล...</p>
            </div>
          ) : repairs.length === 0 ? (
            <div className="bg-white/90 rounded-3xl p-8 shadow-xl border-2 border-[#EFBF86] text-center">
              <p className="text-gray-600 text-lg">ไม่พบข้อมูลแจ้งซ่อม</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {repairs.map((repair) => (
                <div
                  key={repair.id}
                  className="bg-white/90 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#EFBF86] hover:shadow-2xl transition-all"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="md:col-span-2 space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 font-semibold">
                          รหัสแจ้งซ่อม
                        </p>
                        <p className="text-lg font-bold text-[#4E2E16]">
                          #{repair.id}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 font-semibold">
                          ผู้แจ้งซ่อม
                        </p>
                        <p className="text-lg font-semibold text-[#4E2E16]">
                          {repair.user_name}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 font-semibold">
                          สถานที่
                        </p>
                        <p className="text-lg text-[#4E2E16]">
                          {repair.location}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">
                            ประเภทงาน
                          </p>
                          <p className="text-lg text-[#4E2E16]">
                            {repair.type_work}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">
                            วันที่แจ้ง
                          </p>
                          <p className="text-lg text-[#4E2E16]">
                            {new Date(repair.created_at).toLocaleDateString(
                              "th-TH"
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500 font-semibold">
                          รายละเอียด
                        </p>
                        <p className="text-[#4E2E16] break-words">
                          {repair.detail}
                        </p>
                      </div>

                      {repair.img && (
                        <div>
                          <p className="text-sm text-gray-500 font-semibold">
                            ไฟล์แนบ
                          </p>
                          <p className="text-[#4E2E16] text-sm break-words">
                            {repair.img}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => handleDelete(repair.id)}
                        className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        ลบ
                      </button>
                      <button
                        className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                        disabled
                      >
                        แก้ไข (เร็วๆ)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
