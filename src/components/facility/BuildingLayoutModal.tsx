import React, { useState } from 'react';
import {
  Building2,
  BookOpen,
  Home,
  Trees,
  Fish,
  Sun,
  ShieldCheck,
  CheckCircle2,
  X,
  VolumeX,
  Wifi,
  AirVent,
  Layers,
  ArrowRight
} from 'lucide-react';

interface BuildingLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTeaching?: () => void;
}

export const BuildingLayoutModal: React.FC<BuildingLayoutModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTeaching,
}) => {
  const [activeFloor, setActiveFloor] = useState<number>(1);

  if (!isOpen) return null;

  const floors = [
    {
      floorNumber: 4,
      tag: 'Tầng 4',
      badge: 'Sinh thái & Tiện ích',
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      title: 'Sân thượng: Trồng Cây, Nuôi Cá & Sân Phơi Đồ',
      description: 'Không gian xanh thư giãn ngoài trời, điều hòa vi khí hậu cho ngôi nhà và khu vực giặt phơi tiện ích.',
      functions: [
        {
          name: 'Vườn cây xanh & Vườn rau sạch',
          detail: 'Trồng rau củ quả hữu cơ, giàn hoa leo tạo bóng mát, chống nóng tự nhiên cho toàn bộ các tầng dưới.',
          icon: Trees,
          color: 'text-emerald-400',
        },
        {
          name: 'Hồ cá Koi / Bể thủy sinh phong thủy',
          detail: 'Hệ thống lọc tuần hoàn nước, nuôi cá cảnh thư giãn sau giờ dạy học, tạo tiếng róc rách giảm căng thẳng.',
          icon: Fish,
          color: 'text-cyan-400',
        },
        {
          name: 'Khu vực giặt & Sân phơi đồ thông minh',
          detail: 'Máy giặt, giàn phơi đồ tự động đón gió và nắng tự nhiên, có mái kính cường lực che mưa.',
          icon: Sun,
          color: 'text-amber-400',
        },
      ],
      equipment: ['Hệ thống tưới nước tự động', 'Mái kính che mưa di động', 'Hệ thống lọc hồ cá', 'Đèn chiếu sáng năng lượng mặt trời'],
      zoneType: 'Khu sinh thái ngoài trời',
    },
    {
      floorNumber: 3,
      tag: 'Tầng 3',
      badge: 'Không gian gia đình',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      title: 'Tầng 3: Ở Nhà & Không Gian Sinh Hoạt Gia Đình',
      description: 'Khu vực riêng tư hoàn toàn của gia đình giáo viên, nghỉ ngơi sau giờ lên lớp, đảm bảo cách âm tuyệt đối.',
      functions: [
        {
          name: 'Phòng ngủ gia đình & Nghỉ ngơi giáo viên',
          detail: 'Phòng ngủ master yên tĩnh, trang bị nệm êm, ánh sáng dịu nhẹ giúp phục hồi năng lượng.',
          icon: Home,
          color: 'text-purple-400',
        },
        {
          name: 'Phòng sinh hoạt chung / Phòng khách gia đình',
          detail: 'Nơi sum họp gia đình, đọc sách, xem phim, tách biệt hoàn toàn với học sinh ở tầng dưới.',
          icon: Layers,
          color: 'text-blue-400',
        },
        {
          name: 'Bếp ăn ấm cúng & Nhà vệ sinh riêng',
          detail: 'Khu vực bếp nấu hiện đại, máy hút mùi công suất lớn đảm bảo không ám mùi xuống các phòng học.',
          icon: AirVent,
          color: 'text-rose-400',
        },
      ],
      equipment: ['Cửa khóa vân tay cách ly tầng 3', 'Cửa kính cách âm 2 lớp chống ồn', 'Hệ thống điều hòa lọc không khí'],
      zoneType: 'Khu vực riêng tư (Private Living)',
    },
    {
      floorNumber: 2,
      tag: 'Tầng 2',
      badge: 'Dạy và học',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      title: 'Tầng 2: Dạy và Học (Lớp Học Thông Minh & Phòng Chuyên Đề)',
      description: 'Phòng học chính quy mô tiêu chuẩn, bàn ghế di động, trang bị màn hình tương tác thông minh.',
      functions: [
        {
          name: 'Phòng học 201 (Lớp 7A3, 7A1, 9A4)',
          detail: 'Phòng học chuẩn sức chứa 30-40 học sinh, máy chiếu siêu gần/màn hình cảm ứng 75 inch, máy lạnh.',
          icon: BookOpen,
          color: 'text-cyan-400',
        },
        {
          name: 'Phòng học 202 & Góc Khảo Thí (Ngân hàng đề)',
          detail: 'Phòng phụ đạo nhóm nhỏ, khu vực máy scan chấm bài tự động và lưu trữ bài kiểm tra bảo mật.',
          icon: ShieldCheck,
          color: 'text-emerald-400',
        },
        {
          name: 'Góc tự học & Thư viện số mini',
          detail: 'Kệ sách giáo khoa, máy tính bảng tra cứu ngân hàng câu hỏi và làm bài tập trực tuyến.',
          icon: Wifi,
          color: 'text-amber-400',
        },
      ],
      equipment: ['Màn hình dạy học cảm ứng 75 inch', 'Máy scan chấm trắc nghiệm tự động', 'Camera điểm danh AI', 'Wifi Mesh công suất cao'],
      zoneType: 'Khu vực học tập chuyên sâu',
    },
    {
      floorNumber: 1,
      tag: 'Tầng 1',
      badge: 'Dạy và học',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
      title: 'Tầng 1: Dạy và Học (Sảnh Đón Tiếp, Phòng Lab & Xe Học Sinh)',
      description: 'Khu vực tiếp đón phụ huynh, để xe an toàn cho học sinh, phòng học thực hành STEM và khu vệ sinh chung.',
      functions: [
        {
          name: 'Sảnh đón tiếp & Bảng thông báo Thời khóa biểu',
          detail: 'Nơi phụ huynh đưa đón học sinh, bảng điện tử hiển thị thời khóa biểu tự động tuần học 24.',
          icon: Building2,
          color: 'text-cyan-400',
        },
        {
          name: 'Phòng Lab Tin học 1 & Phòng STEM',
          detail: 'Trang bị 25 máy tính kết nối mạng LAN phục vụ làm bài thi trắc nghiệm trên hệ thống Quản lý lớp học.',
          icon: Wifi,
          color: 'text-blue-400',
        },
        {
          name: 'Nhà để xe có mái che & Camera an ninh',
          detail: 'Khu vực để xe đạp, xe máy học sinh rộng rãi, kiểm soát ra vào bằng thẻ từ và camera AI.',
          icon: ShieldCheck,
          color: 'text-emerald-400',
        },
      ],
      equipment: ['Bảng LED hiển thị thời khóa biểu', 'Máy chấm công vân tay / Face ID học sinh', 'Bình chữa cháy & Lối thoát hiểm'],
      zoneType: 'Khu vực tiếp cận công cộng',
    },
  ];

  const currentFloorData = floors.find((f) => f.floorNumber === activeFloor) || floors[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-4xl bg-[#0c1424] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/25 bg-[#091020] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Sơ Đồ Công Năng Căn Nhà 4 Tầng
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-medium">
                  Mô hình Tích Hợp
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Tầng 1-2: Dạy và học • Tầng 3: Ở nhà • Tầng 4: Trồng cây, nuôi cá, phơi đồ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floor Selection Tabs */}
        <div className="grid grid-cols-4 bg-[#080e1a] border-b border-cyan-500/20 p-1.5 gap-1.5">
          {floors.map((fl) => {
            const isSelected = activeFloor === fl.floorNumber;
            return (
              <button
                key={fl.floorNumber}
                onClick={() => setActiveFloor(fl.floorNumber)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span className="font-mono text-sm px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300">
                  {fl.tag}
                </span>
                <span className="text-[11px] truncate">
                  {fl.floorNumber === 1 || fl.floorNumber === 2
                    ? 'Dạy & Học'
                    : fl.floorNumber === 3
                    ? 'Ở Nhà'
                    : 'Cây, Cá, Phơi'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Floor Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Main Floor Title Banner */}
          <div className="bg-[#0e192f] border border-cyan-500/30 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  {currentFloorData.title}
                </span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border w-fit ${currentFloorData.badgeColor}`}>
                {currentFloorData.badge}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {currentFloorData.description}
            </p>
          </div>

          {/* 3 Main Functional Areas of this floor */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-1.5">
              <span>Các phân khu chức năng chi tiết</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {currentFloorData.functions.map((fn, idx) => {
                const Icon = fn.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#091122] border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/40 transition-colors shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700">
                          <Icon className={`w-5 h-5 ${fn.color}`} />
                        </div>
                        <h5 className="text-xs sm:text-sm font-bold text-white leading-snug">
                          {fn.name}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {fn.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Facilities & Smart Equipment */}
          <div className="bg-[#091122] border border-slate-800 rounded-xl p-4">
            <h4 className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Trang thiết bị & Giải pháp tiện ích:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
              {currentFloorData.equipment.map((eq, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#0c162b] p-2 rounded-lg border border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                  <span>{eq}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Integration Note */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-purple-950/40 border border-cyan-500/30 text-xs text-slate-300 flex items-start gap-3">
            <VolumeX className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-cyan-200">Nguyên tắc phân luồng tối ưu:</strong> Tầng 1 và Tầng 2 phục vụ hoàn toàn cho việc giảng dạy và học tập (kết nối trực tiếp với Ngân hàng câu hỏi, Chấm bài tự động và Thời khóa biểu). Cầu thang lên Tầng 3 có cửa khóa bảo mật cách âm để bảo vệ không gian riêng tư của gia đình. Tầng 4 vừa là lá phổi xanh hạ nhiệt cho toàn bộ ngôi nhà vừa là nơi thư giãn, giặt phơi tiện nghi.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#091020] border-t border-cyan-500/20 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Khu vực: <span className="text-cyan-300 font-semibold">{currentFloorData.zoneType}</span>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToTeaching && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToTeaching();
                }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-md shadow-cyan-950"
              >
                <span>Xem Ngân hàng câu hỏi & Lớp học</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
