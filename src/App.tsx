import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppNavbar } from './components/AppNavbar';
import { TeachingNavigation, TEACHING_MENU_ITEMS } from './components/teaching/TeachingNavigation';
import { QuestionBankView } from './components/questionBank/QuestionBankView';
import { HomeworkView } from './components/teaching/HomeworkView';
import { AutoGradingView } from './components/teaching/AutoGradingView';
import { DigitalMaterialsView } from './components/teaching/DigitalMaterialsView';
import { AiAssistantView } from './components/teaching/AiAssistantView';
import { BuildingLayoutModal } from './components/facility/BuildingLayoutModal';

import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { InstructionBanner } from './components/InstructionBanner';
import { TimetableGrid } from './components/TimetableGrid';
import {
  ConfirmDeleteColumnModal,
  ConfirmDeletePeriodModal,
  AddPeriodModal,
  UnsavedChangesModal,
  ImportExcelModal,
} from './components/Modals';
import { ToastContainer } from './components/Toast';
import {
  ALL_DAYS_ORDERED,
  DayKey,
  Period,
  TimetableSchedule,
  ViewTab,
  ToastMessage,
} from './types/timetable';
import {
  DEFAULT_SCHEDULE_7A3,
  loadSchedulesFromStorage,
  saveSchedulesToStorage,
  TARGET_OPTIONS,
} from './utils/timetableDefaults';
import { exportScheduleToExcel } from './utils/excelUtils';
import { MainNavSection, TeachingTab } from './types/questionBank';
import { AppUserProfile } from './types/auth';
import { AuthModal } from './components/auth/AuthModal';
import { testConnection } from './firebase/config';
import {
  logoutUser,
  subscribeToAuth,
  fetchAllTimetablesFromCloud,
  saveTimetableToCloud,
  getSavedActiveUser,
  getUserProfileFromCloud,
} from './firebase/services';

export default function App() {
  // Navigation Module: 'teaching' (Dạy và Học) or 'timetable' (Thời khóa biểu)
  const [activeMainSection, setActiveMainSection] = useState<MainNavSection>('teaching');

  // Active Tab inside "DẠY VÀ HỌC" - ordered strictly as requested:
  // 1: question_bank | 2: homework | 3: auto_grading | 4: digital_docs | 5: ai_assistant
  const [activeTeachingTab, setActiveTeachingTab] = useState<TeachingTab>('question_bank');

  // --- TIMETABLE STATE & PERSISTENCE ---
  const [schedulesMap, setSchedulesMap] = useState<Record<string, TimetableSchedule>>(() => {
    return loadSchedulesFromStorage();
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('class');
  const [currentTargetId, setCurrentTargetId] = useState<string>('class_7A3');

  const activeSchedule: TimetableSchedule = useMemo(() => {
    if (schedulesMap[currentTargetId]) {
      return schedulesMap[currentTargetId];
    }
    const currentOpt = TARGET_OPTIONS[activeTab]?.find((o) => o.id === currentTargetId);
    const targetLabel = currentOpt ? currentOpt.label : currentTargetId;
    return {
      id: `schedule_${currentTargetId}`,
      targetId: currentTargetId,
      type: activeTab,
      title: `Thời khóa biểu - ${targetLabel}`,
      activeDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      periods: DEFAULT_SCHEDULE_7A3.periods,
      grid: {},
      lastUpdated: new Date().toLocaleDateString('vi-VN'),
    };
  }, [schedulesMap, currentTargetId, activeTab]);

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [draftSchedule, setDraftSchedule] = useState<TimetableSchedule>(activeSchedule);

  const [undoStack, setUndoStack] = useState<TimetableSchedule[]>([]);
  const [redoStack, setRedoStack] = useState<TimetableSchedule[]>([]);

  const [columnToDelete, setColumnToDelete] = useState<DayKey | null>(null);
  const [periodToDelete, setPeriodToDelete] = useState<Period | null>(null);
  const [isAddPeriodOpen, setIsAddPeriodOpen] = useState<boolean>(false);
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [isBuildingLayoutOpen, setIsBuildingLayoutOpen] = useState<boolean>(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    type: 'tab' | 'target' | 'section';
    tabValue?: ViewTab;
    targetValue?: string;
    sectionValue?: MainNavSection;
  } | null>(null);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    const id = `${Date.now()}_${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auth State
  const [currentUser, setCurrentUser] = useState<AppUserProfile | null>(() => {
    return getSavedActiveUser();
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  // Initialize Firebase and verify connection
  useEffect(() => {
    testConnection();
    const unsubscribe = subscribeToAuth(async (fbUser) => {
      if (fbUser) {
        // Fetch or create profile
        const cloudProfile = await getUserProfileFromCloud(fbUser.uid);
        if (cloudProfile) {
          setCurrentUser(cloudProfile);
        } else {
          const newProfile: AppUserProfile = {
            uid: fbUser.uid,
            displayName: fbUser.displayName || 'Giáo viên',
            email: fbUser.email || '',
            photoURL: fbUser.photoURL || '',
            role: 'teacher',
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(newProfile);
        }
      }
    });

    // Fetch cloud timetables on startup
    fetchAllTimetablesFromCloud()
      .then((cloudData) => {
        if (cloudData && Object.keys(cloudData).length > 0) {
          setSchedulesMap((prev) => {
            const merged = { ...prev, ...cloudData };
            saveSchedulesToStorage(merged);
            return merged;
          });
        }
      })
      .catch((err) => {
        console.warn('Using local timetable data:', err);
      });

    return () => unsubscribe();
  }, []);

  const handleOpenAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (profile: AppUserProfile) => {
    setCurrentUser(profile);
    addToast('success', `Chào mừng ${profile.displayName || profile.email}! Đăng nhập thành công.`);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      addToast('info', 'Đã đăng xuất tài khoản an toàn.');
    } catch (err: any) {
      console.warn('Logout error:', err);
    }
  };

  useEffect(() => {
    if (!isEditing) {
      setDraftSchedule(activeSchedule);
      setUndoStack([]);
      setRedoStack([]);
    }
  }, [activeSchedule, isEditing]);

  const hasUnsavedChanges = useMemo(() => {
    if (!isEditing) return false;
    return JSON.stringify(draftSchedule) !== JSON.stringify(activeSchedule);
  }, [isEditing, draftSchedule, activeSchedule]);

  const pushDraftState = useCallback((newSchedule: TimetableSchedule) => {
    setUndoStack((prev) => [...prev, draftSchedule]);
    setRedoStack([]);
    setDraftSchedule(newSchedule);
  }, [draftSchedule]);

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => [...prev, draftSchedule]);
    setDraftSchedule(previous);
    addToast('info', 'Đã hoàn tác thao tác vừa rồi');
  }, [undoStack, draftSchedule, addToast]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setUndoStack((prev) => [...prev, draftSchedule]);
    setDraftSchedule(next);
    addToast('info', 'Đã làm lại thao tác');
  }, [redoStack, draftSchedule, addToast]);

  const handleToggleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
      setIsDeleteMode(false);
      setDraftSchedule(JSON.parse(JSON.stringify(activeSchedule)));
      setUndoStack([]);
      setRedoStack([]);
      addToast('info', 'Đã chuyển sang chế độ chỉnh sửa trực tiếp');
    } else {
      if (hasUnsavedChanges) {
        const confirmExit = window.confirm(
          'Bạn đang có thay đổi chưa lưu. Bạn có muốn thoát khỏi chế độ chỉnh sửa và hủy các thay đổi này không?'
        );
        if (!confirmExit) return;
      }
      setIsEditing(false);
      setIsDeleteMode(false);
      setDraftSchedule(activeSchedule);
      setUndoStack([]);
      setRedoStack([]);
    }
  };

  const handleToggleDeleteMode = () => {
    if (!isEditing) {
      setIsEditing(true);
      setIsDeleteMode(true);
      setDraftSchedule(JSON.parse(JSON.stringify(activeSchedule)));
      setUndoStack([]);
      setRedoStack([]);
      addToast('warning', 'Đã bật chế độ chỉnh sửa và chế độ xóa nhanh');
    } else {
      setIsDeleteMode((prev) => !prev);
    }
  };

  const handleSave = () => {
    if (draftSchedule.activeDays.length === 0) {
      addToast('error', 'Lỗi: Thời khóa biểu phải có ít nhất 1 ngày học.');
      return;
    }
    if (draftSchedule.periods.length === 0) {
      addToast('error', 'Lỗi: Thời khóa biểu phải có ít nhất 1 tiết học.');
      return;
    }

    const updatedSchedule: TimetableSchedule = {
      ...draftSchedule,
      lastUpdated: new Date().toLocaleDateString('vi-VN'),
    };

    const nextMap = {
      ...schedulesMap,
      [currentTargetId]: updatedSchedule,
    };

    setSchedulesMap(nextMap);
    const saveSuccess = saveSchedulesToStorage(nextMap);

    if (saveSuccess) {
      // Sync to Firestore Cloud Database
      saveTimetableToCloud(updatedSchedule).catch((err) => {
        console.warn('Sync timetable to cloud failed:', err);
      });

      setIsEditing(false);
      setIsDeleteMode(false);
      setUndoStack([]);
      setRedoStack([]);
      addToast('success', 'Đã lưu thời khóa biểu và đồng bộ lên Firebase Cloud!');
    } else {
      addToast('error', 'Lỗi lưu dữ liệu. Bản nháp của bạn vẫn được giữ nguyên.');
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      const confirmDiscard = window.confirm(
        'Bạn có chắc muốn hủy bỏ các thay đổi và khôi phục về trạng thái đã lưu trước đó không?'
      );
      if (!confirmDiscard) return;
    }
    setIsEditing(false);
    setIsDeleteMode(false);
    setDraftSchedule(activeSchedule);
    setUndoStack([]);
    setRedoStack([]);
    addToast('info', 'Đã hủy bỏ các thay đổi');
  };

  const handleCellChange = (periodId: string, dayKey: DayKey, value: string) => {
    const currentVal = draftSchedule.grid[periodId]?.[dayKey] ?? '';
    if (currentVal === value) return;

    const nextSchedule: TimetableSchedule = {
      ...draftSchedule,
      grid: {
        ...draftSchedule.grid,
        [periodId]: {
          ...(draftSchedule.grid[periodId] || {}),
          [dayKey]: value,
        },
      },
    };
    pushDraftState(nextSchedule);
  };

  const handleDeleteCellContent = (periodId: string, dayKey: DayKey) => {
    const currentVal = draftSchedule.grid[periodId]?.[dayKey] ?? '';
    if (!currentVal || currentVal.trim() === '') return;

    const nextSchedule: TimetableSchedule = {
      ...draftSchedule,
      grid: {
        ...draftSchedule.grid,
        [periodId]: {
          ...(draftSchedule.grid[periodId] || {}),
          [dayKey]: '',
        },
      },
    };
    pushDraftState(nextSchedule);
  };

  const handleAddColumn = () => {
    const currentDays = draftSchedule.activeDays;
    if (currentDays.length >= 7) {
      addToast('error', 'Lỗi: Tuần chỉ có 7 ngày.');
      return;
    }

    const allKeys = ALL_DAYS_ORDERED.map((d) => d.key);
    const missingDays = allKeys.filter((dKey) => !currentDays.includes(dKey));

    if (missingDays.length === 0) {
      addToast('error', 'Lỗi: Tuần chỉ có 7 ngày.');
      return;
    }

    const dayToAdd = missingDays[0];
    const newDays = [...currentDays, dayToAdd].sort(
      (a, b) => allKeys.indexOf(a) - allKeys.indexOf(b)
    );

    const addedDayInfo = ALL_DAYS_ORDERED.find((d) => d.key === dayToAdd);
    const label = addedDayInfo ? addedDayInfo.label : dayToAdd;

    const nextSchedule: TimetableSchedule = {
      ...draftSchedule,
      activeDays: newDays,
    };

    pushDraftState(nextSchedule);
    addToast('success', `Đã thêm cột ${label} vào thời khóa biểu`);
  };

  const handleRequestDeleteColumn = (dayKey: DayKey) => {
    if (draftSchedule.activeDays.length <= 1) {
      addToast('error', 'Không thể xóa: Thời khóa biểu phải có ít nhất 1 ngày học trong tuần.');
      return;
    }

    const hasContent = draftSchedule.periods.some((p) => {
      const val = draftSchedule.grid[p.id]?.[dayKey];
      return val && val.trim() !== '';
    });

    if (hasContent) {
      setColumnToDelete(dayKey);
    } else {
      executeDeleteColumn(dayKey);
    }
  };

  const executeDeleteColumn = (dayKey: DayKey) => {
    const newDays = draftSchedule.activeDays.filter((d) => d !== dayKey);
    const nextGrid = { ...draftSchedule.grid };

    draftSchedule.periods.forEach((p) => {
      if (nextGrid[p.id]) {
        const row = { ...nextGrid[p.id] };
        delete row[dayKey];
        nextGrid[p.id] = row;
      }
    });

    const nextSchedule: TimetableSchedule = {
      ...draftSchedule,
      activeDays: newDays,
      grid: nextGrid,
    };

    const dayInfo = ALL_DAYS_ORDERED.find((d) => d.key === dayKey);
    const label = dayInfo ? dayInfo.label : dayKey;

    pushDraftState(nextSchedule);
    setColumnToDelete(null);
    addToast('info', `Đã xóa cột ${label}`);
  };

  const handleRequestDeletePeriod = (periodId: string) => {
    if (draftSchedule.periods.length <= 1) {
      addToast('error', 'Không thể xóa: Thời khóa biểu phải có ít nhất 1 tiết học.');
      return;
    }
    const p = draftSchedule.periods.find((item) => item.id === periodId);
    if (!p) return;
    setPeriodToDelete(p);
  };

  const executeDeletePeriod = () => {
    if (!periodToDelete) return;

    const remaining = draftSchedule.periods.filter((p) => p.id !== periodToDelete.id);
    const renumberedPeriods: Period[] = remaining.map((p, idx) => ({
      ...p,
      periodNumber: idx + 1,
    }));

    const nextGrid = { ...draftSchedule.grid };
    delete nextGrid[periodToDelete.id];

    const nextSchedule: TimetableSchedule = {
      ...draftSchedule,
      periods: renumberedPeriods,
      grid: nextGrid,
    };

    pushDraftState(nextSchedule);
    setPeriodToDelete(null);
    addToast('info', `Đã xóa Tiết ${periodToDelete.periodNumber}`);
  };

  const handleAddPeriod = (newPeriodData: {
    periodNumber: number;
    startTime: string;
    endTime: string;
    session: 'morning' | 'afternoon';
  }) => {
    const newPeriodId = `p_${Date.now()}`;
    const newPeriod: Period = {
      id: newPeriodId,
      periodNumber: newPeriodData.periodNumber,
      startTime: newPeriodData.startTime,
      endTime: newPeriodData.endTime,
      session: newPeriodData.session,
    };

    const nextPeriods = [...draftSchedule.periods, newPeriod];
    const nextGrid = {
      ...draftSchedule.grid,
      [newPeriodId]: {},
    };

    const nextSchedule: TimetableSchedule = {
      ...draftSchedule,
      periods: nextPeriods,
      grid: nextGrid,
    };

    pushDraftState(nextSchedule);
    setIsAddPeriodOpen(false);
    addToast('success', `Đã thêm Tiết ${newPeriod.periodNumber} (${newPeriod.startTime} - ${newPeriod.endTime})`);
  };

  const handleTabChange = (newTab: ViewTab) => {
    if (newTab === activeTab) return;
    if (hasUnsavedChanges) {
      setPendingNavigation({ type: 'tab', tabValue: newTab });
      return;
    }
    setActiveTab(newTab);
    const firstOption = TARGET_OPTIONS[newTab]?.[0]?.id || '';
    setCurrentTargetId(firstOption);
    setIsEditing(false);
    setIsDeleteMode(false);
  };

  const handleTargetChange = (newTargetId: string) => {
    if (newTargetId === currentTargetId) return;
    if (hasUnsavedChanges) {
      setPendingNavigation({ type: 'target', targetValue: newTargetId });
      return;
    }
    setCurrentTargetId(newTargetId);
    setIsEditing(false);
    setIsDeleteMode(false);
  };

  const handleMainSectionChange = (section: MainNavSection) => {
    if (section === activeMainSection) return;
    if (hasUnsavedChanges) {
      setPendingNavigation({ type: 'section', sectionValue: section });
      return;
    }
    setActiveMainSection(section);
  };

  const confirmPendingNavigation = () => {
    if (!pendingNavigation) return;
    if (pendingNavigation.type === 'section' && pendingNavigation.sectionValue) {
      setActiveMainSection(pendingNavigation.sectionValue);
    } else if (pendingNavigation.type === 'tab' && pendingNavigation.tabValue) {
      setActiveTab(pendingNavigation.tabValue);
      const firstOpt = TARGET_OPTIONS[pendingNavigation.tabValue]?.[0]?.id || '';
      setCurrentTargetId(firstOpt);
    } else if (pendingNavigation.type === 'target' && pendingNavigation.targetValue) {
      setCurrentTargetId(pendingNavigation.targetValue);
    }
    setIsEditing(false);
    setIsDeleteMode(false);
    setPendingNavigation(null);
  };

  const displaySchedule = isEditing ? draftSchedule : activeSchedule;
  const currentTeachingItem = TEACHING_MENU_ITEMS.find((item) => item.id === activeTeachingTab);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. TOP APP NAVBAR - Switch between "DẠY VÀ HỌC" and "Thời khóa biểu" */}
      <AppNavbar
        activeSection={activeMainSection}
        onSectionChange={handleMainSectionChange}
        activeTeachingSubLabel={currentTeachingItem?.label}
        onOpenBuildingLayout={() => setIsBuildingLayoutOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
        isCloudSynced={true}
      />

      {/* 2. IF IN "DẠY VÀ HỌC" MODULE: SUB-NAVIGATION WITH THE 5 ORDERED TABS */}
      {activeMainSection === 'teaching' && (
        <>
          <TeachingNavigation
            activeTab={activeTeachingTab}
            onTabChange={setActiveTeachingTab}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Vị trí 1: Ngân hàng câu hỏi */}
            {activeTeachingTab === 'question_bank' && (
              <QuestionBankView
                onAssignToHomework={() => {
                  setActiveTeachingTab('homework');
                  addToast('info', 'Đã chuyển các câu hỏi đã chọn sang màn hình Giao bài tập');
                }}
              />
            )}

            {/* Vị trí 2: Giao bài tập */}
            {activeTeachingTab === 'homework' && <HomeworkView />}

            {/* Vị trí 3: Chấm bài tự động */}
            {activeTeachingTab === 'auto_grading' && <AutoGradingView />}

            {/* Vị trí 4: Tài liệu số */}
            {activeTeachingTab === 'digital_docs' && <DigitalMaterialsView />}

            {/* Vị trí 5: AI HỖ TRỢ */}
            {activeTeachingTab === 'ai_assistant' && <AiAssistantView />}
          </main>
        </>
      )}

      {/* 3. IF IN "THỜI KHÓA BIỂU" MODULE: RENDER THE FULL INTERACTIVE SCHEDULE SYSTEM */}
      {activeMainSection === 'timetable' && (
        <>
          <div className="no-print">
            <Header
              activeTab={activeTab}
              onTabChange={handleTabChange}
              currentTargetId={currentTargetId}
              onTargetChange={handleTargetChange}
              isEditing={isEditing}
              hasUnsavedChanges={hasUnsavedChanges}
            />
          </div>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
            <div className="no-print">
              <Toolbar
                isEditing={isEditing}
                isDeleteMode={isDeleteMode}
                canUndo={undoStack.length > 0}
                canRedo={redoStack.length > 0}
                hasUnsavedChanges={hasUnsavedChanges}
                onToggleEdit={handleToggleEdit}
                onToggleDeleteMode={handleToggleDeleteMode}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onSave={handleSave}
                onCancel={handleCancel}
                onOpenImport={() => setIsImportOpen(true)}
                onExportExcel={() => exportScheduleToExcel(displaySchedule)}
                onPrint={() => window.print()}
              />
            </div>

            <div className="no-print">
              <InstructionBanner
                isEditing={isEditing}
                isDeleteMode={isDeleteMode}
                onExitDeleteMode={() => setIsDeleteMode(false)}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-cyan-500/15">
              <div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span className="text-cyan-400">📅</span>
                  <span>{displaySchedule.title}</span>
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span>{displaySchedule.activeDays.length} ngày học</span>
                  <span>·</span>
                  <span>{displaySchedule.periods.length} tiết / ngày</span>
                  <span>·</span>
                  <span>Cập nhật: {displaySchedule.lastUpdated || 'Hôm nay'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isEditing ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  {isEditing ? (isDeleteMode ? 'Chế độ: Xóa nhanh' : 'Chế độ: Chỉnh sửa trực tiếp') : 'Chế độ: Xem thời khóa biểu'}
                </span>
              </div>
            </div>

            <div className="print-area">
              <TimetableGrid
                activeDays={displaySchedule.activeDays}
                periods={displaySchedule.periods}
                grid={displaySchedule.grid}
                isEditing={isEditing}
                isDeleteMode={isDeleteMode}
                onCellChange={handleCellChange}
                onDeleteCellContent={handleDeleteCellContent}
                onAddColumn={handleAddColumn}
                onRequestDeleteColumn={handleRequestDeleteColumn}
                onRequestDeletePeriod={handleRequestDeletePeriod}
                onOpenAddPeriodModal={() => setIsAddPeriodOpen(true)}
              />
            </div>
          </main>
        </>
      )}

      {/* Modals & Dialogs */}
      <ConfirmDeleteColumnModal
        isOpen={columnToDelete !== null}
        dayKey={columnToDelete}
        onConfirm={() => columnToDelete && executeDeleteColumn(columnToDelete)}
        onCancel={() => setColumnToDelete(null)}
      />

      <ConfirmDeletePeriodModal
        isOpen={periodToDelete !== null}
        period={periodToDelete}
        onConfirm={executeDeletePeriod}
        onCancel={() => setPeriodToDelete(null)}
      />

      <AddPeriodModal
        isOpen={isAddPeriodOpen}
        nextPeriodNumber={displaySchedule.periods.length + 1}
        existingPeriods={displaySchedule.periods}
        onAddPeriod={handleAddPeriod}
        onCancel={() => setIsAddPeriodOpen(false)}
      />

      <UnsavedChangesModal
        isOpen={pendingNavigation !== null}
        onStay={() => setPendingNavigation(null)}
        onDiscardAndLeave={confirmPendingNavigation}
      />

      <ImportExcelModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onApplyImport={(data) => {
          const newSchedule: TimetableSchedule = {
            ...displaySchedule,
            activeDays: data.activeDays,
            periods: data.periods,
            grid: data.grid,
            lastUpdated: new Date().toLocaleDateString('vi-VN'),
          };
          if (isEditing) {
            pushDraftState(newSchedule);
          } else {
            setIsEditing(true);
            setDraftSchedule(newSchedule);
            setUndoStack([activeSchedule]);
            setRedoStack([]);
          }
          addToast('success', 'Đã nạp dữ liệu từ file Excel!');
        }}
      />

      {/* Building 4-Floor Layout Modal */}
      <BuildingLayoutModal
        isOpen={isBuildingLayoutOpen}
        onClose={() => setIsBuildingLayoutOpen(false)}
        onNavigateToTeaching={() => setActiveMainSection('teaching')}
      />

      {/* Auth Modal for Login and Registration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
