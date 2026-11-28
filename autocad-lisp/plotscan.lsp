;;; PLOTSCAN.LSP — Quét 1 vùng chọn, tìm đúng các khu vực in (chưa in)
;;;
;;; Lệnh thử nghiệm đi kèm PLOTPDF, làm riêng để kiểm chứng bài toán
;;; CHỌN ĐÚNG KHU VỰC IN trước khi nối vào phần in:
;;;
;;; Cách dùng: APPLOAD file này trong AutoCAD, gõ lệnh PLOTSCAN,
;;; pick góc đầu P1 rồi góc đối P2 (kéo 1 vùng chọn duy nhất).
;;; Lệnh quét mọi đối tượng chạm vào vùng chọn, tìm các rectang
;;; ngoài cùng (chính là các khu vực in), sắp xếp theo chiều kéo
;;; P1 -> P2 kiểu chữ Z, đánh dấu ảo khung đỏ + số thứ tự lên từng
;;; khung và in báo cáo ra dòng lệnh. Lệnh KHÔNG in PDF, KHÔNG tạo
;;; hay sửa entity thật trong bản vẽ; REGEN/REDRAW là dấu ảo mất.
;;; Danh sách khung tìm được (đã sắp xếp) lưu trong biến toàn cục
;;; *ps-last* dạng (ename x1 y1 x2 y2 handle) để bước sau nối vào
;;; PLOTPDF dùng lại.
;;;
;;; Thuật toán (đã thảo luận và chốt với user 2026-11-28):
;;; 1. Chọn Crossing qua P1/P2: rectang nào bị vùng chọn CHẠM vào
;;;    là tính, kể cả chỉ thò một phần vào; khu vực in là toàn bộ
;;;    rectang đó, không cắt theo vùng chọn. Không quan tâm layer.
;;; 2. Chỉ xét polyline khép kín 4 đỉnh là hình chữ nhật thẳng trục
;;;    (khung coi như luôn thẳng, không xoay). Khung bao chuẩn hoá
;;;    (x1 y1)-(x2 y2) lấy từ min/max các đỉnh, không tin thứ tự
;;;    đỉnh. Khử các rectang trùng khít nhau (dung sai *ps-tol*).
;;; 3. Rectang ngoài cùng: sắp xếp diện tích giảm dần, duyệt từ
;;;    lớn tới nhỏ — rectang nằm trọn trong một rectang đã giữ thì
;;;    bỏ (rectang trong: lề trong, ô khung tên...), không nằm
;;;    trong cái nào thì giữ. Các khung coi như luôn rời nhau nên
;;;    mỗi ổ lồng nhau cho đúng 1 khung ngoài cùng.
;;; 4. Bẫy rectang bao tổng: 1 rectang bao cả vùng chọn sẽ nuốt
;;;    mọi khung ở bước 3. Chặn bằng cách bóc thử nó ra và chạy
;;;    lại bước 3 trên phần nằm trong nó: nếu ra từ 2 rectang trở
;;;    lên mà kích thước quy về giấy ở tỉ lệ *ps-scale* (mặc định
;;;    1/100) đều hợp lý (mỗi cạnh *ps-paper-min*..*ps-paper-max*
;;;    mm giấy) thì nó là bao tổng — loại nó, lấy các khung con.
;;;    Nếu chỉ ra 1 rectang hợp lý (lề trong của chính nó) thì nó
;;;    là khung thật, giữ nguyên. Khung tuỳ ý tỉ lệ nên KHÔNG lọc
;;;    theo tỉ lệ khổ giấy (1,4142) — tỉ lệ khung là bất kỳ.
;;; 5. Thứ tự: suy từ chiều kéo P1 -> P2 (điểm kéo đầu là góc xuất
;;;    phát) + kiểu đi chữ Z: nhóm hàng theo tâm Y (dung sai =
;;;    một nửa chiều cao khung trung bình), trong hàng xếp theo
;;;    tâm X. Hàng và chiều trong hàng đều lật theo chiều kéo.
;;;
;;; Hằng số chỉnh được ở ngay dưới: *ps-scale* (tỉ lệ bản vẽ, chỉ
;;; dùng cho kiểm tra bao tổng và báo cáo quy về giấy), khoảng
;;; giấy hợp lý, dung sai hình học *ps-tol* (đơn vị bản vẽ, mặc
;;; định 0,5 — bản vẽ mm).
;;;
;;; Tương thích: tránh ActiveX (không vla-/vlax-) như PLOTPDF để
;;; chạy cả AutoCAD for Mac; khung bao tính từ đỉnh polyline.
;;; Bài học từ HATCHSOLID/PLOTPDF: *error* luôn in thông báo lỗi
;;; thật; mỗi đối tượng xử lý có bắt lỗi riêng, một đối tượng lạ
;;; không làm chết cả lệnh.

(setq *ps-scale* 100.0)        ; ti le ban ve: 1/100
(setq *ps-paper-min* 140.0)    ; canh giay nho nhat hop ly (mm giay)
(setq *ps-paper-max* 1250.0)   ; canh giay lon nhat hop ly (mm giay)
(setq *ps-tol* 0.5)            ; dung sai hinh hoc (don vi ban ve)

;; *ps-last* (danh sách khung của lần quét gần nhất) cố ý KHÔNG
;; khởi tạo lại khi nạp file, để APPLOAD lại không mất kết quả.

(defun ps-area (r)
  ;; r = (ename x1 y1 x2 y2 handle)
  (* (- (nth 3 r) (nth 1 r)) (- (nth 4 r) (nth 2 r)))
)

(defun ps-cx (r) (/ (+ (nth 1 r) (nth 3 r)) 2.0))
(defun ps-cy (r) (/ (+ (nth 2 r) (nth 4 r)) 2.0))

(defun ps-contained-p (inner outer / eps)
  ;; inner nam tron trong outer (co dung sai *ps-tol*)?
  (setq eps *ps-tol*)
  (and (>= (nth 1 inner) (- (nth 1 outer) eps))
       (<= (nth 3 inner) (+ (nth 3 outer) eps))
       (>= (nth 2 inner) (- (nth 2 outer) eps))
       (<= (nth 4 inner) (+ (nth 4 outer) eps)))
)

(defun ps-same-bbox-p (a b)
  ;; Hai khung bao trung khit nhau trong dung sai?
  (and (<= (abs (- (nth 1 a) (nth 1 b))) *ps-tol*)
       (<= (abs (- (nth 2 a) (nth 2 b))) *ps-tol*)
       (<= (abs (- (nth 3 a) (nth 3 b))) *ps-tol*)
       (<= (abs (- (nth 4 a) (nth 4 b))) *ps-tol*))
)

(defun ps-vertices (en data / elev pt pts e vd)
  ;; Danh sách đỉnh WCS (x y) của polyline, thuần entget/entnext
  ;; như pp-bbox của PLOTPDF (không ActiveX, chạy được trên Mac).
  ;; LWPOLYLINE: điểm group 10 là OCS, đổi sang WCS bằng trans
  ;; với cao độ group 38. POLYLINE cũ: điểm 10 của VERTEX là WCS.
  (setq pts nil)
  (if (= (cdr (assoc 0 data)) "LWPOLYLINE")
    (progn
      (setq elev (cond ((cdr (assoc 38 data))) (0.0)))
      (foreach pt data
        (if (= (car pt) 10)
          (setq pt (trans (list (cadr pt) (caddr pt) elev) en 0)
                pts (append pts (list (list (car pt) (cadr pt)))))))
    )
    (progn
      (setq e (entnext en))
      (while (and e (= (cdr (assoc 0 (setq vd (entget e)))) "VERTEX"))
        (setq pt (cdr (assoc 10 vd))
              pts (append pts (list (list (car pt) (cadr pt))))
              e (entnext e)))
    )
  )
  ;; Polyline đôi khi lặp đỉnh cuối = đỉnh đầu dù đã khép kín:
  ;; bỏ đỉnh cuối trùng đó trước khi đếm.
  (if (and (> (length pts) 1)
           (<= (abs (- (car (car pts)) (car (last pts)))) *ps-tol*)
           (<= (abs (- (cadr (car pts)) (cadr (last pts)))) *ps-tol*))
    (setq pts (reverse (cdr (reverse pts))))
  )
  pts
)

(defun ps-rect-bbox (pts / x1 y1 x2 y2 ok codes cd pt)
  ;; Từ đúng 4 đỉnh, kiểm tra hình chữ nhật thẳng trục và trả
  ;; khung bao (x1 y1 x2 y2); không đạt thì trả nil.
  ;; Mỗi đỉnh phải là 1 góc của khung bao (x = x1 hoặc x2, y = y1
  ;; hoặc y2 trong dung sai) và 4 đỉnh phải phủ đủ 4 góc khác
  ;; nhau (mã góc 0..3, tránh 2 đỉnh trùng 1 góc, thiếu 1 góc).
  (setq x1 (apply 'min (mapcar 'car pts))
        x2 (apply 'max (mapcar 'car pts))
        y1 (apply 'min (mapcar 'cadr pts))
        y2 (apply 'max (mapcar 'cadr pts))
        ok (and (> (- x2 x1) *ps-tol*) (> (- y2 y1) *ps-tol*))
        codes nil)
  (if ok
    (progn
      (foreach pt pts
        (if (not (and (or (<= (abs (- (car pt) x1)) *ps-tol*)
                          (<= (abs (- (car pt) x2)) *ps-tol*))
                      (or (<= (abs (- (cadr pt) y1)) *ps-tol*)
                          (<= (abs (- (cadr pt) y2)) *ps-tol*))))
          (setq ok nil)
          (setq cd (+ (if (<= (abs (- (car pt) x2)) *ps-tol*) 1 0)
                      (if (<= (abs (- (cadr pt) y2)) *ps-tol*) 2 0))
                codes (if (member cd codes) codes (cons cd codes)))
        )
      )
      (if (/= (length codes) 4) (setq ok nil))
    )
  )
  (if ok (list x1 y1 x2 y2) nil)
)

(defun ps-cmp-area (a b)
  ;; So sánh cho vl-sort: diện tích giảm dần, hoà thì handle lớn
  ;; hơn đứng trước. Có tie-break duy nhất để vl-sort không loại
  ;; mất phần tử "bằng nhau" (hành vi đã biết của vl-sort).
  (cond ((/= (ps-area a) (ps-area b)) (> (ps-area a) (ps-area b)))
        (T (> (nth 5 a) (nth 5 b))))
)

(defun ps-outermost (cands / kept c blocked)
  ;; Thuật toán tham lam diện tích giảm dần: giữ các rectang
  ;; không nằm trong bất kỳ rectang nào đã giữ.
  (setq kept nil)
  (foreach c (vl-sort cands 'ps-cmp-area)
    (setq blocked nil)
    (foreach k kept
      (if (ps-contained-p c k) (setq blocked T))
    )
    (if (not blocked) (setq kept (append kept (list c))))
  )
  kept
)

(defun ps-plausible-p (r / pw ph)
  ;; Kích thước quy về giấy ở tỉ lệ *ps-scale* có hợp lý không:
  ;; cả 2 cạnh giấy đều trong khoảng *ps-paper-min*..*ps-paper-max*.
  (setq pw (/ (- (nth 3 r) (nth 1 r)) *ps-scale*)
        ph (/ (- (nth 4 r) (nth 2 r)) *ps-scale*))
  (and (>= pw *ps-paper-min*) (<= pw *ps-paper-max*)
       (>= ph *ps-paper-min*) (<= ph *ps-paper-max*))
)

(defun ps-children (parent cands / out c)
  ;; Mọi ứng viên nằm trọn trong parent (trừ chính parent).
  (setq out nil)
  (foreach c cands
    (if (and (/= (nth 5 c) (nth 5 parent)) (ps-contained-p c parent))
      (setq out (append out (list c)))
    )
  )
  out
)

;; Biến toàn cục cho các hàm so sánh thứ tự: chiều sắp xếp suy từ
;; chiều kéo P1 -> P2, đặt trước khi gọi vl-sort.
(setq *ps-topfirst* T)   ; T: hàng trên trước; nil: hàng dưới trước
(setq *ps-leftfirst* T)  ; T: trong hàng trái trước; nil: phải trước

(defun ps-cmp-row (a b)
  ;; Thứ tự duyệt hàng: tâm Y theo chiều dọc đã chọn trước,
  ;; hoà thì tâm X theo chiều ngang, cuối cùng handle.
  (cond ((/= (ps-cy a) (ps-cy b))
         (if *ps-topfirst* (> (ps-cy a) (ps-cy b)) (< (ps-cy a) (ps-cy b))))
        ((/= (ps-cx a) (ps-cx b))
         (if *ps-leftfirst* (< (ps-cx a) (ps-cx b)) (> (ps-cx a) (ps-cx b))))
        (T (> (nth 5 a) (nth 5 b))))
)

(defun ps-cmp-inrow (a b)
  ;; Thứ tự trong 1 hàng: tâm X theo chiều ngang đã chọn trước,
  ;; hoà thì tâm Y, cuối cùng handle.
  (cond ((/= (ps-cx a) (ps-cx b))
         (if *ps-leftfirst* (< (ps-cx a) (ps-cx b)) (> (ps-cx a) (ps-cx b))))
        ((/= (ps-cy a) (ps-cy b))
         (if *ps-topfirst* (> (ps-cy a) (ps-cy b)) (< (ps-cy a) (ps-cy b))))
        (T (> (nth 5 a) (nth 5 b))))
)

(defun ps-sort-z (frames / avg rowtol sorted rows row anchor out r)
  ;; Sắp xếp chữ Z: nhóm hàng theo tâm Y (dung sai = một nửa
  ;; chiều cao khung trung bình của nhóm), hàng nối hàng theo
  ;; chiều dọc, trong hàng xếp theo tâm X. Chiều đã nằm trong
  ;; *ps-topfirst* / *ps-leftfirst* do hàm so sánh đọc.
  (setq avg 0.0)
  (foreach r frames (setq avg (+ avg (- (nth 4 r) (nth 2 r)))))
  (setq rowtol (* 0.5 (/ avg (length frames)))
        sorted (vl-sort frames 'ps-cmp-row)
        rows nil row nil anchor nil)
  (foreach r sorted
    (if (or (not row) (> (abs (- (ps-cy r) anchor)) rowtol))
      (progn
        (if row (setq rows (append rows (list row))))
        (setq row (list r) anchor (ps-cy r))
      )
      (setq row (append row (list r)))
    )
  )
  (if row (setq rows (append rows (list row))))
  (setq out nil)
  (foreach row rows
    (setq out (append out (vl-sort row 'ps-cmp-inrow)))
  )
  out
)

(defun ps-digit (ch)
  ;; Các nét vẽ của 1 chữ số trên lưới x: 0..2, y: 0..3.
  ;; Sao từ pp-digit của PLOTPDF để hai file nạp chung không
  ;; đụng tên hàm mà vẫn cùng một kiểu số.
  (cdr
    (assoc ch
      '(("0" ((0 0) (2 0)) ((2 0) (2 3)) ((2 3) (0 3)) ((0 3) (0 0)))
        ("1" ((0.4 2.3) (1 3)) ((1 3) (1 0)) ((0 0) (2 0)))
        ("2" ((0 3) (2 3)) ((2 3) (2 1.5)) ((2 1.5) (0 0)) ((0 0) (2 0)))
        ("3" ((0 3) (2 3)) ((2 3) (2 0)) ((2 0) (0 0)) ((0.6 1.5) (2 1.5)))
        ("4" ((0 3) (0 1.5)) ((0 1.5) (2 1.5)) ((2 3) (2 0)))
        ("5" ((2 3) (0 3)) ((0 3) (0 1.5)) ((0 1.5) (2 1.5)) ((2 1.5) (2 0)) ((2 0) (0 0)))
        ("6" ((2 3) (0 1.5)) ((0 1.5) (0 0)) ((0 0) (2 0)) ((2 0) (2 1.5)) ((2 1.5) (0 1.5)))
        ("7" ((0 3) (2 3)) ((2 3) (0.8 0)))
        ("8" ((0 0) (2 0)) ((2 0) (2 3)) ((2 3) (0 3)) ((0 3) (0 0)) ((0 1.5) (2 1.5)))
        ("9" ((0 3) (2 3)) ((2 3) (2 0)) ((0 3) (0 1.5)) ((0 1.5) (2 1.5)))
       )
    )
  )
)

(defun ps-mark (x1 y1 x2 y2 n / s len dh unit dw gap tw ox oy i dx sg vecs)
  ;; Đánh dấu ẢO màu đỏ: khung theo đúng khu vực in + số thứ tự
  ;; to ở giữa (cao 40% chiều cao khung). Vẽ bằng grvecs như
  ;; pp-mark của PLOTPDF — đồ họa tạm, REGEN/REDRAW là tự mất.
  (setq s (itoa n)
        len (strlen s)
        dh (* 0.4 (- y2 y1))
        unit (/ dh 3.0)
        dw (* 2.0 unit)
        gap (* 0.9 unit)
        tw (+ (* len dw) (* (1- len) gap))
        ox (- (/ (+ x1 x2) 2.0) (/ tw 2.0))
        oy (- (/ (+ y1 y2) 2.0) (/ dh 2.0))
        vecs (list 1 (list x1 y1) (list x2 y1)
                   1 (list x2 y1) (list x2 y2)
                   1 (list x2 y2) (list x1 y2)
                   1 (list x1 y2) (list x1 y1))
        i 0)
  (while (< i len)
    (setq dx (+ ox (* i (+ dw gap))))
    (foreach sg (ps-digit (substr s (1+ i) 1))
      (setq vecs
        (append vecs
          (list 1
                (list (+ dx (* (car (car sg)) unit))
                      (+ oy (* (cadr (car sg)) unit)))
                (list (+ dx (* (car (cadr sg)) unit))
                      (+ oy (* (cadr (cadr sg)) unit)))))))
    (setq i (1+ i)))
  (grvecs vecs)
)

(defun ps-fmt (v) (rtos v 2 1))

(defun c:PLOTSCAN (/ *error* p1u p2u p1 p2 ss i en data typ pts bb rec
                    total nnotpoly nnotclosed nnot4 nnotrect
                    cands dedup dup kept containers round changed
                    newkept k childs sub plaus ordered n inner blocked d s)
  (defun *error* (msg)
    (princ (strcat "\nCancelled. Error: " msg))
    (princ)
  )

  ;; Chặn trường hợp đang ở trong viewport của layout như PLOTPDF:
  ;; tọa độ lúc đó không phải tọa độ model.
  (if (and (= (getvar "TILEMODE") 0) (> (getvar "CVPORT") 1))
    (princ "\nYou are inside a viewport - exit and run again.")
    (progn
      (setq p1u (getpoint "\nPick first corner P1 of the scan region: "))
      (if p1u (setq p2u (getcorner p1u "\nPick opposite corner P2: ")))
      (if (or (not p1u) (not p2u))
        (princ "\nRegion selection cancelled.")
        (progn
          ;; ssget nhận điểm theo UCS hiện hành như lúc pick;
          ;; logic sắp xếp/báo cáo dùng WCS nên đổi riêng 1 bản.
          (setq p1 (trans p1u 1 0)
                p2 (trans p2u 1 0))
          ;; Chiều sắp xếp suy từ chiều kéo P1 -> P2.
          (setq *ps-leftfirst* (<= (car p1) (car p2))
                *ps-topfirst* (>= (cadr p1) (cadr p2)))
          ;; --- Bước 1+2: quét Crossing, phân loại, chuẩn hoá ---
          (setq ss (ssget "_C" p1u p2u)
                total 0 nnotpoly 0 nnotclosed 0 nnot4 0 nnotrect 0
                cands nil)
          (if ss
            (progn
              (setq total (sslength ss) i 0)
              (while (< i total)
                (setq en (ssname ss i)
                      i (1+ i))
                (vl-catch-all-apply
                  '(lambda ()
                     (setq data (entget en)
                           typ (cdr (assoc 0 data)))
                     (cond
                       ((not (member typ '("LWPOLYLINE" "POLYLINE")))
                        (setq nnotpoly (1+ nnotpoly)))
                       ((/= 1 (logand 1 (cdr (assoc 70 data))))
                        (setq nnotclosed (1+ nnotclosed)))
                       (T
                        (setq pts (ps-vertices en data))
                        (cond
                          ((/= (length pts) 4)
                           (setq nnot4 (1+ nnot4)))
                          ((not (setq bb (ps-rect-bbox pts)))
                           (setq nnotrect (1+ nnotrect)))
                          (T
                           (setq rec (list en (nth 0 bb) (nth 1 bb)
                                           (nth 2 bb) (nth 3 bb)
                                           (cdr (assoc 5 data)))
                                 cands (append cands (list rec))))
                        ))
                     ))
                  nil)
              )
            )
          )
          ;; --- Khử trùng khít ---
          (setq dedup nil dup 0)
          (foreach rec cands
            (setq blocked nil)
            (foreach d dedup
              (if (ps-same-bbox-p rec d) (setq blocked T))
            )
            (if blocked
              (setq dup (1+ dup))
              (setq dedup (append dedup (list rec)))
            )
          )
          ;; --- Bước 3: rectang ngoài cùng ---
          (setq kept (ps-outermost dedup)
                containers 0)
          ;; --- Bước 4: bóc rectang bao tổng (tối đa 3 vòng) ---
          (setq round 0 changed T)
          (while (and changed (< round 3))
            (setq round (1+ round) changed nil newkept nil)
            (foreach k kept
              (setq childs (ps-children k dedup)
                    sub (ps-outermost childs)
                    plaus nil)
              (foreach s sub
                (if (ps-plausible-p s) (setq plaus (append plaus (list s))))
              )
              (if (>= (length plaus) 2)
                (progn
                  (setq containers (1+ containers) changed T
                        newkept (append newkept plaus))
                  (princ (strcat "\nWarning: rectangle "
                                 (ps-fmt (- (nth 3 k) (nth 1 k))) " x "
                                 (ps-fmt (- (nth 4 k) (nth 2 k)))
                                 " is a super-container (it contained "
                                 (itoa (length plaus))
                                 " plausible frame(s)) - removed."))
                )
                (setq newkept (append newkept (list k)))
              )
            )
            (setq kept newkept)
          )
          ;; --- Bước 5: sắp xếp chữ Z + đánh dấu + báo cáo ---
          (setq ordered (if kept (ps-sort-z kept) nil)
                *ps-last* ordered
                n (length ordered)
                inner (- (length dedup) n containers))
          (setq i 0)
          (foreach r ordered
            (setq i (1+ i))
            (vl-catch-all-apply 'ps-mark
              (list (nth 1 r) (nth 2 r) (nth 3 r) (nth 4 r) i))
          )
          (princ (strcat "\n--- PLOTSCAN ---"))
          (princ (strcat "\nRegion P1 (" (ps-fmt (car p1)) ", " (ps-fmt (cadr p1))
                         ") -> P2 (" (ps-fmt (car p2)) ", " (ps-fmt (cadr p2)) ")"))
          (princ (strcat "\nObjects touched by the region: " (itoa total)
                         " | not a polyline: " (itoa nnotpoly)
                         " | polyline not closed: " (itoa nnotclosed)
                         " | not exactly 4 vertices: " (itoa nnot4)
                         " | 4 vertices but not an axis-aligned rectangle: "
                         (itoa nnotrect)))
          (princ (strcat "\nValid rectangles: " (itoa (length cands))
                         " | exact duplicates removed: " (itoa dup)
                         " | inner rectangles removed: " (itoa inner)
                         " | super-containers removed: " (itoa containers)))
          (princ (strcat "\n>>> OUTERMOST FRAMES (PRINT AREAS): " (itoa n)))
          (setq i 0)
          (foreach r ordered
            (setq i (1+ i))
            (princ (strcat "\n  " (itoa i) ". ("
                           (ps-fmt (nth 1 r)) ", " (ps-fmt (nth 2 r)) ") - ("
                           (ps-fmt (nth 3 r)) ", " (ps-fmt (nth 4 r)) ") | model "
                           (ps-fmt (- (nth 3 r) (nth 1 r))) " x "
                           (ps-fmt (- (nth 4 r) (nth 2 r))) " | paper @1/"
                           (itoa (fix *ps-scale*)) ": "
                           (ps-fmt (/ (- (nth 3 r) (nth 1 r)) *ps-scale*)) " x "
                           (ps-fmt (/ (- (nth 4 r) (nth 2 r)) *ps-scale*)) " mm"))
          )
          (if (> n 0)
            (princ "\nVirtual marks drawn: red frame + order number on each frame. REGEN/REDRAW to clear. Check the frame count and order by eye before printing.")
            (princ "\nNo frames found - see the removal counts above for the reasons.")
          )
        )
      )
    )
  )
  (princ)
)

(princ "\nPLOTSCAN loaded - run PLOTSCAN, pick P1 then P2 to scan one region and find the print areas (scan only, no printing).")
(princ)
