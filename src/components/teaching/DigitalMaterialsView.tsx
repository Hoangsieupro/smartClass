import React, { useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Search,
  BookOpen,
  Folder,
  Layers,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';

export const DigitalMaterialsView: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [search, setSearch] = useState('');

  const materials = [
    {
      id: 'doc1',
      title: 'Giáo án điện tử chuẩn CV 5512: Căn bậc hai và Căn thức bậc hai',
      type: 'Giáo án Word',
      subject: 'Toán học',
      grade: 'Khối 9',
      fileSize: '2.4 MB',
      downloads: 142,
      lastUpdated: '14/10/2026',
    },
    {
      id: 'doc2',
      title: 'Slide bài giảng tương tác: Định luật Ôm và Đoạn mạch nối tiếp',
      type: 'PowerPoint / Slide',
      subject: 'Vật lý',
      grade: 'Khối 9',
      fileSize: '18.6 MB',
      downloads: 98,
      lastUpdated: '12/10/2026',
    },
    {
      id: 'doc3',
      title: 'Chuyên đề bồi dưỡng HSG: Bất đẳng thức Cauchy và Kỹ thuật chọn điểm rơi',
      type: 'PDF Chuyên đề',
      subject: 'Toán học',
      grade: 'Khối 9',
      fileSize: '5.1 MB',
      downloads: 230,
      lastUpdated: '10/10/2026',
    },
    {
      id: 'doc4',
      title: 'Phim tư liệu & Tư liệu số: Thời kỳ Bắc thuộc và các cuộc đấu tranh giành độc lập',
      type: 'Đa phương tiện',
      subject: 'Lịch sử & Địa lý',
      grade: 'Khối 7',
      fileSize: '45.0 MB',
      downloads: 75,
      lastUpdated: '08/10/2026',
    },
    {
      id: 'doc5',
      title: 'Bộ đề thi thử tuyển sinh vào 10 môn Tiếng Anh có giải chi tiết (Năm 2026)',
      type: 'Bộ đề thi',
      subject: 'Tiếng Anh',
      grade: 'Khối 9',
      fileSize: '3.8 MB',
      downloads: 310,
      lastUpdated: '06/10/2026',
    },
  ];

  const filtered = materials.filter((m) => {
    if (selectedSubject !== 'Tất cả' && m.subject !== selectedSubject) return false;
    if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="bg-[#0c1424] border border-cyan-500/25 rounded-xl p-4 sm:p-5 shadow-lg shadow-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Kho Học Liệu & Tài Liệu Số Giáo Dục
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Lưu trữ giáo án điện tử theo Công văn 5512, bài giảng trình chiếu, sách giáo khoa số và học liệu tương tác
            </p>
          </div>
        </div>

        <button
          onClick={() => alert('Mở form tải lên tài liệu mới')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-950 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tải lên tài liệu mới</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#0c1424] border border-cyan-500/20 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tài liệu, giáo án..."
            className="w-full bg-[#080e1a] border border-cyan-500/30 text-xs md:text-sm text-cyan-100 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-400 placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {['Tất cả', 'Toán học', 'Vật lý', 'Tiếng Anh', 'Lịch sử & Địa lý'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubject === sub
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white bg-[#091020]'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="bg-[#0d1629] border border-cyan-500/20 hover:border-cyan-500/40 rounded-xl p-4 transition-all shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#11243d] text-cyan-300 border border-cyan-500/30">
                  {doc.type}
                </span>
                <span className="text-xs text-slate-400">
                  {doc.subject} • {doc.grade}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white hover:text-cyan-300 cursor-pointer leading-snug">
                {doc.title}
              </h3>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-3">
                <span>Dung lượng: {doc.fileSize}</span>
                <span>•</span>
                <span>Lượt tải: {doc.downloads}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Đang tải xuống: ${doc.title}`)}
                  className="p-1.5 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-950/60 transition-colors"
                  title="Tải về máy"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => alert(`Xem trực tuyến: ${doc.title}`)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Xem tài liệu"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
