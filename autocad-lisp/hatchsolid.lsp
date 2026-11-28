;;; HATCHSOLID.LSP — Chuyển toàn bộ HATCH thành SOLID
;;;
;;; Cách dùng: APPLOAD file này trong AutoCAD, rồi gõ 1 trong 2 lệnh:
;;;   HATCHSOLID    — SOLID, trong suốt 60% (nhìn xuyên qua được 60%)
;;;   HATCHSOLIDDUC — SOLID, KHÔNG trong suốt (đục hoàn toàn)
;;;
;;; - Mọi HATCH trong bản vẽ (model space + các layout) đổi thành SOLID.
;;; - Lệnh HATCHSOLID dùng mức trong suốt *hs-transparency* ở dưới
;;;   (mặc định 60). Muốn mức khác: đổi số đó.
;;;   VD: muốn đục 60% (trong suốt 40%) thì đặt 40.
;;; - Lệnh HATCHSOLIDDUC đặt trong suốt = 0%, tức đặt group 440 về
;;;   đục hoàn toàn (không phụ thuộc transparency của layer).
;;; - Màu giữ nguyên như hatch đang dùng (không động vào màu).
;;; - HATCH nằm trong block (block definition) không được đổi — chỉ đổi
;;;   hatch đặt trực tiếp trên bản vẽ.
;;; - HATCH trên layer bị khóa được BỎ QUA (không báo lỗi), các hatch còn
;;;   lại vẫn chuyển đổi bình thường; cuối lệnh báo số hatch đã bỏ qua.
;;; - Muốn hoàn tác cả loạt: 1 lần Ctrl+Z / UNDO (đã gom thành 1 bước undo).
;;;
;;; Cách làm:
;;; - Đổi pattern bằng ActiveX method SetPattern (type 1 = predefined,
;;;   name "SOLID") để AutoCAD tự dọn dữ liệu pattern cũ. Theo tài
;;;   liệu Autodesk, PatternName "không đổi pattern type" — gán
;;;   PatternName = "SOLID" cho hatch có type user-defined/custom sẽ
;;;   bị từ chối với lỗi "Type mismatch" (bản 4 chỉ đổi được 95/1191
;;;   vì vậy). SetPattern đổi cả type lẫn name nên đúng cho mọi hatch.
;;;   LƯU Ý: KHÔNG dùng vla-put-PatternName — trên máy user (CAD 2022)
;;;   gọi nó qua vl-catch-all-apply báo "bad function" (wrapper không
;;;   có sẵn khi truyền dạng symbol). Dùng vlax-invoke 'SetPattern.
;;; - Fallback nếu SetPattern lỗi: entmod đổi pattern theo đúng cách
;;;   ezdxf set_solid_fill làm — 2 = "SOLID", 70 = 1, 76 = 1
;;;   (predefined), 77 = 0, 78 = 0, XÓA dữ liệu định nghĩa pattern
;;;   (53, 43, 44, 45, 46, 79, 49) và dữ liệu gradient (450-453,
;;;   460-463). Chỉ đổi 2 + 70 mà để lại dữ liệu pattern cũ thì
;;;   entmod cũng bị từ chối.
;;; - Độ trong suốt vẫn phải dùng entmod (group 440), nhưng phải CHÈN
;;;   440 vào đúng vị trí: cuối phần AcDbEntity, ngay trước marker
;;;   (100 . "AcDbHatch"). Đã kiểm chứng vị trí bằng file DXF xuất từ
;;;   ezdxf: 440 nằm ngay trước marker AcDbHatch.
;;;   Group 440 = 0x02000000 + alpha, alpha = 255 * (100 - transparency%) / 100.
;;; - Hatch gradient: XÓA hẳn các group gradient (450-453, 460-463)
;;;   thay vì chỉ đặt 450 = 0, giống cách ezdxf set_solid_fill làm.
;;; - Mỗi hatch được xử lý trong vl-catch-all-apply riêng: một hatch
;;;   lỗi không làm chết cả lệnh nữa, chỉ bị đếm vào số lỗi và báo
;;;   thông báo lỗi đầu tiên gặp để chẩn đoán.
;;;   (Bản trước chết giữa chừng, chỉ hiện "Da huy." vì *error* nuốt
;;;   mất thông báo lỗi thật.)

(vl-load-com)

;; Độ trong suốt theo % (0 = đục hoàn toàn, 90 = mức tối đa trên giao diện AutoCAD)
(setq *hs-transparency* 60)

;; Thông báo lỗi đầu tiên gặp trong lúc chạy (để báo cáo chẩn đoán)
(setq *hs-firsterr* nil)

(defun hs-set-dxf (data code value / old)
  ;; Đặt group code trong entity data: có rồi thì thay, chưa có thì thêm.
  (if (setq old (assoc code data))
    (subst (cons code value) old data)
    (append data (list (cons code value)))
  )
)

(defun hs-set-if-exists (data code value / old)
  ;; Đặt group code CHỈ khi đã có trong data (tránh gắn sai vị trí).
  (if (setq old (assoc code data))
    (subst (cons code value) old data)
    data
  )
)

(defun hs-remove-codes (data codes / out)
  ;; Xóa khỏi entity data mọi group có code nằm trong danh sách codes.
  (setq out nil)
  (foreach item data
    (if (not (member (car item) codes))
      (setq out (cons item out))
    )
  )
  (reverse out)
)

(defun hs-insert-440 (data trval / out done item)
  ;; Chèn (440 . trval) ngay trước marker (100 . "AcDbHatch"),
  ;; tức cuối phần AcDbEntity — vị trí đúng của group 440.
  ;; Không thấy marker (hiếm) thì gắn cuối như cũ.
  (setq out nil done nil)
  (foreach item data
    (if (and (not done) (equal item '(100 . "AcDbHatch")))
      (progn
        (setq out (cons (cons 440 trval) out))
        (setq done T)
      )
    )
    (setq out (cons item out))
  )
  (if (not done)
    (setq out (cons (cons 440 trval) out))
  )
  (reverse out)
)

(defun hs-layer-locked-p (layername / laydata)
  ;; Layer có bị khóa không? (bit 4 của group 70 trong bảng LAYER)
  (setq laydata (tblsearch "LAYER" layername))
  (and laydata
       (/= 0 (logand 4 (cdr (assoc 70 laydata)))))
)

(defun hs-convert-one (en trval / obj data res res2 patok)
  ;; Chuyển 1 hatch. Trả về mã trạng thái:
  ;;   0 = xong, 1 = lỗi đổi pattern, 2 = lỗi đặt trong suốt, 3 = layer khóa
  (setq data (entget en))
  (if (hs-layer-locked-p (cdr (assoc 8 data)))
    3
    (progn
      ;; Bước 1: đổi pattern sang SOLID
      (setq obj (vlax-ename->vla-object en))
      (setq patok nil)
      ;; Cách 1: ActiveX method SetPattern (type 1 = predefined,
      ;; name "SOLID") — đổi cả type lẫn name nên đúng cho mọi hatch.
      ;; (Gán riêng PatternName bị lỗi "Type mismatch" với hatch có
      ;; type user-defined/custom vì nó không đổi pattern type.)
      (setq res (vl-catch-all-apply
                  'vlax-invoke (list obj 'SetPattern 1 "SOLID")))
      (if (vl-catch-all-error-p res)
        (progn
          ;; Cách 2 (fallback): entmod đổi pattern kiểu ezdxf
          ;; set_solid_fill — dọn sạch dữ liệu pattern + gradient cũ
          (setq data (entget en))
          (setq data (hs-set-dxf data 2 "SOLID"))
          (setq data (hs-set-dxf data 70 1))
          (setq data (hs-set-if-exists data 76 1)) ; predefined
          (setq data (hs-set-if-exists data 77 0)) ; không double
          (setq data (hs-set-if-exists data 78 0)) ; 0 dòng định nghĩa
          (setq data (hs-remove-codes
                       data '(53 43 44 45 46 79 49 ; dữ liệu pattern
                              450 451 452 453 460 461 462 463))) ; gradient
          (setq res2 (vl-catch-all-apply 'entmod (list data)))
          (if (and (not (vl-catch-all-error-p res2)) res2)
            (setq patok T)
            (if (not *hs-firsterr*)
              (setq *hs-firsterr*
                    (strcat "doi pattern: " (vl-catch-all-error-message res)))
            )
          )
        )
        (setq patok T)
      )
      (if (not patok)
        1
        (progn
          ;; Bước 2: độ trong suốt bằng entmod (đọc lại data
          ;; sau khi đổi pattern)
          (setq data (entget en))
          ;; Xóa hẳn dữ liệu gradient nếu hatch đang là gradient fill
          (if (assoc 450 data)
            (setq data (hs-remove-codes
                         data '(450 451 452 453 460 461 462 463)))
          )
          (if (assoc 440 data)
            (setq data (subst (cons 440 trval) (assoc 440 data) data))
            (setq data (hs-insert-440 data trval))
          )
          (setq res (vl-catch-all-apply 'entmod (list data)))
          (cond
            ((vl-catch-all-error-p res)
             (if (not *hs-firsterr*)
               (setq *hs-firsterr*
                     (strcat "dat trong suot: " (vl-catch-all-error-message res)))
             )
             2
            )
            ((null res) 2) ; entmod trả nil = bị từ chối
            (T 0)
          )
        )
      )
    )
  )
)

(defun hs-run (transp / *error* doc ss n i en trval ok patfail trfail skip otherfail res)
  ;; Chạy chuyển đổi với mức trong suốt transp (0-90).
  ;; Gọi qua lệnh HATCHSOLID (60%) hoặc HATCHSOLIDDUC (0%).
  ;; Gom toàn bộ thao tác thành 1 bước undo
  (setq doc (vla-get-ActiveDocument (vlax-get-acad-object)))
  (defun *error* (msg)
    (vla-EndUndoMark doc)
    (princ (strcat "\nCancelled. Error: " msg))
    (princ)
  )
  (vla-StartUndoMark doc)

  (setq *hs-firsterr* nil)

  ;; Giá trị transparency cho group 440
  (setq trval (+ 33554432
                 (fix (* 255 (/ (- 100.0 transp) 100.0)))))

  (setq ss (ssget "X" '((0 . "HATCH"))))
  (if (not ss)
    (princ "\nNo HATCH objects in this drawing.")
    (progn
      (setq n (sslength ss)
            i 0
            ok 0
            patfail 0
            trfail 0
            skip 0
            otherfail 0)
      (while (< i n)
        (setq en (ssname ss i))
        ;; Xử lý từng hatch trong catch-all riêng: một hatch lỗi
        ;; không làm chết cả lệnh
        (setq res (vl-catch-all-apply 'hs-convert-one (list en trval)))
        (if (vl-catch-all-error-p res)
          (progn
            (setq otherfail (1+ otherfail))
            (if (not *hs-firsterr*)
              (setq *hs-firsterr* (vl-catch-all-error-message res))
            )
          )
          (cond
            ((= res 0) (setq ok (1+ ok)))
            ((= res 1) (setq patfail (1+ patfail)))
            ((= res 2) (setq trfail (1+ trfail)))
            ((= res 3) (setq skip (1+ skip)))
          )
        )
        (setq i (1+ i))
      )
      (princ (strcat "\nConverted " (itoa ok) "/" (itoa n)
                     " HATCH to SOLID, "
                     (if (= transp 0)
                       "fully opaque"
                       (strcat "transparency " (itoa transp) "%"))
                     ", colors unchanged."))
      (if (> skip 0)
        (princ (strcat "\nSkipped " (itoa skip)
                       " HATCH on locked layers."))
      )
      (if (> patfail 0)
        (princ (strcat "\n" (itoa patfail)
                       " HATCH could not change pattern."))
      )
      (if (> trfail 0)
        (princ (strcat "\n" (itoa trfail)
                       " HATCH changed pattern but could not set transparency."))
      )
      (if (> otherfail 0)
        (princ (strcat "\n" (itoa otherfail)
                       " HATCH failed with other errors."))
      )
      (if *hs-firsterr*
        (princ (strcat "\nFirst error encountered: " *hs-firsterr*))
      )
    )
  )
  (vla-EndUndoMark doc)
  (princ)
)

(defun c:HATCHSOLID ()
  ;; SOLID, trong suốt theo *hs-transparency* (mặc định 60%)
  (hs-run *hs-transparency*)
  (princ)
)

(defun c:HATCHSOLIDDUC ()
  ;; SOLID, không trong suốt (đục hoàn toàn)
  (hs-run 0)
  (princ)
)

(princ "\nHATCHSOLID loaded - run HATCHSOLID (SOLID, 60% transparent) or HATCHSOLIDDUC (SOLID, fully opaque).")
(princ)
