import React, { useState } from 'react';
import {
  CheckCircle2,
  Scan,
  Upload,
  FileCheck,
  Award,
  AlertTriangle,
  Download,
  Filter,
  Eye,
  RefreshCw
} from 'lucide-react';

export const AutoGradingView: React.FC = () => {
  const [examName, setExamName] = useState('Bài kiểm tra 15 phút - Căn bậc hai (Lớp 7A3)');
  const [isScanning, setIsScanning] = useState(false);
  const [gradedStudents, setGradedStudents] = useState([
    {
      id: 'hs1',
      rollNo: '7A3-01',
      name: 'Nguyễn An Khang',
      correctCount: 9,
      totalCount: 10,
      score: 9.0,
      confidence: '99.4%',
      status: 'success', // success, needs_review
      gradedAt: '18/10/2026 14:22',
    },
    {
      id: 'hs2',
      rollNo: '7A3-02',
      name: 'Trần Bảo Ngọc',
      correctCount: 10,
      totalCount: 10,
      score: 10.0,
      confidence: '99.8%',
      status: 'success',
      gradedAt: '18/10/2026 14:22',
    },
    {
      id: 'hs3',
      rollNo: '7A3-03',
      name: 'Lê Hoàng Minh',
      correctCount: 7,
      totalCount: 10,
      score: 7.0,
      confidence: '91.2%',
      status: 'needs_review', // Needs check on câu 4
      gradedAt: '18/10/2026 14:23',
    },
    {
      id: 'hs4',
      rollNo: '7A3-04',
      name: 'Phạm Thu Trang',
      correctCount: 8,
      totalCount: 10,
      score: 8.0,
      confidence: '98.5%',
      status: 'success',
      gradedAt: '18/10/2026 14:23',
    },
    {
      id: 'hs5',
      rollNo: '7A3-05',
      name: 'Vũ Đức Thịnh',
      correctCount: 8,
      totalCount: 10,
      score: 8.0,
      confidence: '97.9%',
      status: 'success',
      gradedAt: '18/10/2026 14:24',
    },
  ]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const newStudent = {
        id: `hs_${Date.now()}`,
        rollNo: `7A3-0${gradedStudents.length + 1}`,
        name: 'Đỗ Hải Đăng',
        correctCount: 9,
        totalCount: 10,
        score: 9.0,
        confidence: '99.1%',
        status: 'success',
        gradedAt: 'Vừa xong',
      };
      setGradedStudents((prev) => [newStudent, ...prev]);
    }, 1500);
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="bg-[#0c1424] border border-cyan-500/25 rounded-xl p-4 sm:p-5 shadow-lg shadow-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                Chấm Bài Tự Động & Nhận Diện Thị Giác OCR
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Tự động chấm phiếu trắc nghiệm qua ảnh chụp hoặc file scan, nhận diện đáp án bằng AI và tổng hợp sổ điểm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950 transition-all cursor-pointer"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang xử lý ảnh scan...</span>
              </>
            ) : (
              <>
                <Scan className="w-4 h-4" />
                <span>Quét / Tải Phiếu Chấm</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Zone / Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0d1629] border border-cyan-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-lg">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Đã chấm thành công</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">
              {gradedStudents.length} bài
            </div>
          </div>
        </div>

        <div className="bg-[#0d1629] border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-lg">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Điểm cao nhất / Điểm TB</div>
            <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
              10.0 / 8.8
            </div>
          </div>
        </div>

        <div className="bg-[#0d1629] border border-amber-500/20 rounded-xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Cần giáo viên đối soát</div>
            <div className="text-xl font-bold text-amber-400 font-mono mt-0.5">
              1 bài (tô mờ)
            </div>
          </div>
        </div>
      </div>

      {/* Graded Students Table */}
      <div className="bg-[#0c1424] border border-cyan-500/25 rounded-xl shadow-lg overflow-hidden">
        <div className="p-3.5 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="text-xs font-semibold text-cyan-300 flex items-center gap-2">
            <span>Danh sách kết quả chấm bài gần nhất:</span>
            <span className="text-slate-300 font-normal">({examName})</span>
          </div>

          <button
            onClick={() => alert('Đã xuất danh sách điểm ra file Excel')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111e36] text-cyan-200 border border-cyan-500/30 hover:bg-cyan-950/60 text-xs font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất bảng điểm Excel</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm">
            <thead className="bg-[#091020] text-slate-400 font-semibold border-b border-cyan-500/20">
              <tr>
                <th className="py-3 px-4">Mã số HS</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4 text-center">Số câu đúng</th>
                <th className="py-3 px-4 text-center">Điểm số</th>
                <th className="py-3 px-4 text-center">Độ tin cậy OCR</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {gradedStudents.map((st) => (
                <tr key={st.id} className="hover:bg-cyan-950/20 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                    {st.rollNo}
                  </td>
                  <td className="py-3 px-4 font-medium text-white">{st.name}</td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="text-emerald-400 font-bold">{st.correctCount}</span> /{' '}
                    {st.totalCount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                      {st.score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-slate-300">
                    {st.confidence}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {st.status === 'success' ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                        Chính xác 100%
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                        Cần đối soát
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-xs text-slate-400 font-mono">
                    {st.gradedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
