import { useRef, useState } from 'react';
import { Loader2, Sparkles, X } from 'lucide-react';
import type { Building } from '../model/schema';
import { generateFloorplan, MAX_ATTEMPTS } from '../ai/generateFloorplan';
import { GEMINI_MODEL, getSavedApiKey } from '../ai/gemini';
import type { PlanSummary } from '../ai/validateGenerated';

interface AiGenerateDialogProps {
  onClose: () => void;
  onApply: (building: Building) => void;
}

type Phase = 'form' | 'generating' | 'result' | 'error';

const inputClass =
  'w-full rounded-xl border border-syn-border bg-syn-field px-3 py-2 text-sm text-syn-ink outline-none focus:border-syn-accent';

/** Hộp thoại tạo mặt bằng bằng AI (Gemini). Theo đúng idiom ExportDialog. */
export default function AiGenerateDialog({ onClose, onApply }: AiGenerateDialogProps) {
  const [description, setDescription] = useState('');
  // Key đọc từ phần Cài đặt (panel trái, mục AI) — dialog không giữ ô nhập key.
  const [hasKey, setHasKey] = useState(() => Boolean(getSavedApiKey()?.trim()));
  const [phase, setPhase] = useState<Phase>('form');
  const [attempt, setAttempt] = useState(1);
  const [result, setResult] = useState<{ building: Building; summary: PlanSummary } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Modal thật: chỉ đóng khi bấm nút Đóng (X) hoặc Hủy — không đóng
  // khi bấm ra ngoài hay nhấn Escape.

  const runGenerate = () => {
    const key = getSavedApiKey()?.trim() ?? '';
    if (!description.trim() || !key) {
      setHasKey(Boolean(key));
      return;
    }
    setError(null);
    setResult(null);
    setPhase('generating');
    const controller = new AbortController();
    abortRef.current = controller;
    void generateFloorplan({
      apiKey: key,
      description,
      signal: controller.signal,
      onAttempt: setAttempt,
    })
      .then(({ building, summary }) => {
        setResult({ building, summary });
        setPhase('result');
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setPhase('form');
          return;
        }
        setError(err instanceof Error ? err.message : 'Tạo mặt bằng thất bại.');
        setPhase('error');
      });
  };

  const cancelGenerate = () => {
    abortRef.current?.abort();
    abortRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Tạo mặt bằng bằng AI"
        className="w-full max-w-lg rounded-3xl bg-white p-5 shadow-xl"
        // Phím gõ trong dialog không lọt ra phím tắt app (Space pan, đổi tool…).
        onKeyDown={(e) => e.nativeEvent.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-base font-semibold text-syn-ink">
            <Sparkles size={18} strokeWidth={1.5} />
            Tạo mặt bằng bằng AI
          </span>
          <button
            type="button"
            title="Đóng"
            disabled={phase === 'generating'}
            onClick={onClose}
            className="rounded-lg p-1.5 text-syn-grey hover:bg-syn-field hover:text-syn-ink disabled:opacity-40"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {phase === 'form' && (
          <>
            <p className="mt-3 text-sm text-syn-grey">
              Mô tả ngôi nhà muốn tạo. Mô tả càng cụ thể càng tốt: kích thước, số phòng, hướng cửa
              chính.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              autoFocus
              placeholder="VD: Nhà 1 tầng 8×12m: phòng khách, bếp + ăn, 2 phòng ngủ, 1 phòng tắm, cửa chính hướng nam"
              className={`${inputClass} mt-3 resize-none`}
            />
            {hasKey ? (
              <p className="mt-3 text-xs text-syn-grey">
                Dùng key Gemini đã lưu (đổi key ở mục AI trong panel Cài đặt). Mô hình:{' '}
                {GEMINI_MODEL} (gói miễn phí).
              </p>
            ) : (
              <div className="mt-3 rounded-xl border border-yellow-300 bg-yellow-50 p-3">
                <p className="text-sm text-yellow-900">
                  Chưa có API key Gemini. Nhập key ở mục AI trong panel Cài đặt: đóng hộp thoại
                  này, bấm vào khoảng trống trên canvas để hiện panel Cài đặt.
                </p>
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-syn-border bg-white px-4 py-2 text-sm font-medium text-syn-ink hover:bg-syn-field"
              >
                Hủy
              </button>
              <button
                type="button"
                disabled={!description.trim() || !hasKey}
                onClick={runGenerate}
                className="rounded-full bg-syn-ink px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
              >
                Tạo mặt bằng
              </button>
            </div>
          </>
        )}

        {phase === 'generating' && (
          <div className="mt-6 flex flex-col items-center gap-3 py-6">
            <Loader2 size={28} strokeWidth={1.5} className="animate-spin text-syn-grey" />
            <p className="text-sm text-syn-ink">
              Đang tạo mặt bằng… (lần {attempt}/{MAX_ATTEMPTS})
            </p>
            <p className="text-xs text-syn-grey">
              Gemini đang vẽ, app sẽ kiểm tra cửa chồng nhau trước khi hiện kết quả.
            </p>
            <button
              type="button"
              onClick={cancelGenerate}
              className="mt-1 rounded-full border border-syn-border bg-white px-4 py-2 text-sm font-medium text-syn-ink hover:bg-syn-field"
            >
              Hủy
            </button>
          </div>
        )}

        {phase === 'result' && result && (
          <>
            <div className="mt-4 rounded-xl bg-syn-field p-4">
              <p className="text-sm font-medium text-syn-ink">Đã tạo xong — xem trước khi áp dụng</p>
              <p className="mt-1 text-sm text-syn-grey">
                Kích thước bao{' '}
                {(result.summary.widthMm / 1000).toFixed(1)}×{(result.summary.heightMm / 1000).toFixed(1)} m
                {' · '}
                {result.summary.wallCount} tường · {result.summary.doorCount} cửa đi ·{' '}
                {result.summary.windowCount} cửa sổ
              </p>
            </div>
            <p className="mt-3 text-xs text-syn-grey">
              Áp dụng sẽ thay bản vẽ hiện tại (vẫn hoàn tác được bằng Ctrl+Z).
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPhase('form')}
                className="rounded-full border border-syn-border bg-white px-4 py-2 text-sm font-medium text-syn-ink hover:bg-syn-field"
              >
                Sửa mô tả
              </button>
              <button
                type="button"
                onClick={runGenerate}
                className="rounded-full border border-syn-border bg-white px-4 py-2 text-sm font-medium text-syn-ink hover:bg-syn-field"
              >
                Tạo lại
              </button>
              <button
                type="button"
                onClick={() => onApply(result.building)}
                className="rounded-full bg-syn-ink px-4 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Áp dụng
              </button>
            </div>
          </>
        )}

        {phase === 'error' && (
          <>
            <div className="mt-4 rounded-xl border border-yellow-300 bg-yellow-50 p-4">
              <p className="whitespace-pre-line text-sm text-yellow-900">{error}</p>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPhase('form')}
                className="rounded-full border border-syn-border bg-white px-4 py-2 text-sm font-medium text-syn-ink hover:bg-syn-field"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={runGenerate}
                className="rounded-full bg-syn-ink px-4 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Thử lại
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
