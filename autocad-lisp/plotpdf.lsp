;;; PLOTPDF.LSP — In hàng loạt vùng rectang ra PDF (model space)
;;;
;;; Cách dùng: APPLOAD file này trong AutoCAD, ở model space (hoặc
;;; paper space của layout), gõ lệnh PLOTPDF, click chọn từng rectang
;;; theo thứ tự muốn in, Enter để kết thúc chọn, rồi chọn thư mục lưu.
;;;
;;; - Mỗi rectang (polyline khép kín) là 1 vùng in -> 1 file PDF riêng.
;;; - File đặt tên: <tên bản vẽ>_01.pdf, _02.pdf... theo ĐÚNG thứ tự
;;;   click chọn rectang. Vì vậy phải click từng cái một: ssget không
;;;   giữ thứ tự click (nó trả object theo thứ tự database).
;;; - Mỗi lần chạy cho chọn lại thư mục lưu.
;;; - Mỗi rectang vừa chọn được đánh dấu ngay bằng 1 khung đỏ ẢO
;;;   kèm số thứ tự to ở giữa khung (vẽ bằng grvecs — đồ họa tạm,
;;;   không tạo entity thật trong bản vẽ). Chạy REGEN hoặc REDRAW
;;;   là các dấu tự mất.
;;; - Rectang đã in thành công ở lần chạy trước (trong cùng phiên
;;;   mở bản vẽ) sẽ bị bỏ qua khi click lại, tránh chọn lại in
;;;   trùng. Muốn in lại từ đầu thì chạy lệnh PLOTPDFRESET để xóa
;;;   danh sách đã in.
;;; - Cách in: mỗi rectang in bằng lệnh -PLOT ở chế độ CHI TIẾT,
;;;   tự khai toàn bộ thông số ngay trong chuỗi lệnh (thiết bị, khổ
;;;   giấy, vùng Window + 2 góc, Fit, Center, plot style) — các giá
;;;   trị này sao đúng page setup đã đặt trước của bản vẽ:
;;;   máy "DWG To PDF - NO PREVIEW.pc3", giấy A4, monochrome.ctb.
;;;   Đổi máy in/khổ/style thì sửa các giá trị trong pp-plot-one.
;;;   Trả lời "Save changes: No" nên page setup của bản vẽ không
;;;   bị thay đổi sau khi in.
;;; - Chạy được cả trên AutoCAD for Mac (sửa 2026-11-26): Mac
;;;   không có ActiveX/COM — tài liệu Autodesk ghi rõ vl-load-com
;;;   và các hàm vla-/vlax-/vlr- chỉ có trên Windows — nên file
;;;   tránh ActiveX: khung bao tính từ đỉnh polyline, chọn thư mục
;;;   trên Mac lùi về getfiled. Riêng tên máy in trong pp-plot-one
;;;   là pc3 tự chế phía Windows, máy Mac sẽ không có — chạy trên
;;;   Mac thì sửa tên máy/khổ giấy trong pp-plot-one theo máy Mac.
;;;   Thêm nữa (test Mac tối 26-11): biến BACKGROUNDPLOT bị Mac
;;;   từ chối đặt ("AutoCAD variable setting rejected") vì Mac
;;;   không có in nền — lỗi đó từng làm lệnh chết ngay sau bước
;;;   chọn thư mục, chưa in được file nào. Nay mọi lần đọc/đặt
;;;   biến hệ thống đều đi qua pp-getvar/pp-setvar có bắt lỗi:
;;;   biến bị từ chối thì bỏ qua (trên Mac in luôn ở tiền cảnh
;;;   nên bước kiểm chứng file PDF sau khi in vẫn đáng tin).
;;; - Khung nhìn (view) được giữ nguyên như trước khi chạy lệnh.
;;; - Rectang trên layer khóa vẫn in bình thường (in không sửa entity).
;;;
;;; NÂNG CẤP 2026-11-28 — nối PLOTSCAN vào PLOTPDF (đã thảo luận
;;; và kiểm chứng riêng bằng lệnh PLOTSCAN trước khi nối):
;;; - Thêm CHẾ ĐỘ CHỌN "Scan" bên cạnh chế độ cũ "Pick"
;;;   (mặc định vẫn là Pick, hành vi cũ không đổi): pick P1
;;;   rồi P2, lệnh quét Crossing 1 vùng duy nhất — rectang nào
;;;   bị chạm vào là tính, không quan tâm layer; chỉ nhận
;;;   polyline khép kín 4 đỉnh là hình chữ nhật thẳng trục;
;;;   chuẩn hoá khung bao, khử trùng khít, giữ rectang ngoài
;;;   cùng bằng thuật toán diện tích giảm dần, bóc thử chặn
;;;   rectang bao tổng (quy về giấy ở tỉ lệ 1/100, cạnh hợp lý
;;;   140..1250mm); sắp xếp chữ Z theo chiều kéo P1 -> P2;
;;;   bỏ qua rectang đã in ở lần chạy trước như chế độ cũ;
;;;   đánh dấu ảo + báo cáo, hỏi xác nhận mới in. Thuật toán
;;;   này giữ nguyên từ PLOTSCAN (tiền tố pps-), PLOTSCAN user
;;;   đã test trên bản vẽ thật 28-11: "khá ổn, nhận dạng tốt".
;;; - Thêm OPTION TỈ LỆ Ở KHÂU IN, hỏi sau khi chọn thư mục:
;;;   Fit (như cũ, ép vừa A4) hoặc Scale (tỉ lệ cố định 1/N, N
;;;   mặc định 100): khổ giấy ISO tự chọn theo từng khung —
;;;   khổ nhỏ nhất từ A4 tới A0 mà khung ở tỉ lệ đó vừa (đã
;;;   trừ lề 5mm mỗi phía); khung lớn hơn A0 ở tỉ lệ đó thì
;;;   lùi về Fit vào A0 và ghi chú rõ ở dòng báo cáo file đó.
;;;   Chuỗi tỉ lệ truyền vào -PLOT dạng "1=N". Chế độ Scale là
;;;   mới, cần test thật trên 1 khung trước khi in cả loạt.
;;;
;;; Bài học rút ra (kiểm chứng thực tế + tra cứu tài liệu Autodesk,
;;; 2026-11-25):
;;; - KHÔNG in theo cửa sổ bằng ActiveX SetWindowToPlot/PlotToFile
;;;   trong model space: cửa sổ lưu trong page setup được bộ máy in
;;;   hiểu theo hệ tọa độ hiển thị (DCS), không phải WCS — đặt/đọc
;;;   lại qua ActiveX thì khớp nhau (vòng tròn khép kín) nhưng khi
;;;   in lại lệch hàng trăm nghìn đơn vị vào vùng trống, ra PDF
;;;   trắng. Diễn đàn Autodesk (mục .NET và VBA) ghi nhận rõ hiện
;;;   tượng này; cách lách được đánh dấu Solved là ZoomWindow +
;;;   PlotType = Display.
;;; - Lệnh -PLOT ở chế độ KHÔNG chi tiết không nhận cửa sổ mới:
;;;   nó in theo đúng cửa sổ đã lưu trong page setup (vẫn là cửa
;;;   sổ lệch nói trên) nên cũng trắng.
;;; - Cách in hàng loạt theo cửa sổ trong model space đã được kiểm
;;;   chứng rộng rãi (VD bài Solved của hmsilva trên diễn đàn
;;;   Autodesk): -PLOT CHI TIẾT, khai Window + 2 góc trực tiếp
;;;   trong chuỗi lệnh — lệnh tự đặt vùng in, không qua cửa sổ
;;;   lưu trong page setup.
;;; Bài học áp dụng từ HATCHSOLID: *error* luôn in ra thông báo lỗi
;;; thật; mỗi rectang xử lý riêng, một rectang lỗi không chết cả lệnh.

;; vl-load-com chỉ để nạp hỗ trợ ActiveX cho hộp chọn thư mục kiểu
;; Windows (pp-pick-folder). AutoCAD for Mac không có ActiveX —
;; gọi thẳng sẽ văng lỗi "vl-load-com not supported" và file nạp
;; dở dang, nên bọc catch-all: Windows nạp bình thường, Mac bỏ qua.
(vl-catch-all-apply 'vl-load-com nil)

(defun pp-pad (i width / s)
  ;; Đệm số 0 ở trước: 1 -> "01" khi width = 2
  (setq s (itoa i))
  (while (< (strlen s) width)
    (setq s (strcat "0" s))
  )
  s
)

(defun pp-getvar (name / v)
  ;; getvar co bat loi: bien khong ton tai / khong doc duoc -> nil.
  (setq v (vl-catch-all-apply 'getvar (list name)))
  (if (vl-catch-all-error-p v) nil v)
)

(defun pp-setvar (name val)
  ;; setvar co bat loi. Ly do: AutoCAD for Mac TU CHOI dat bien
  ;; BACKGROUNDPLOT ("AutoCAD variable setting rejected") vi Mac
  ;; khong co in nen — neu khong bat loi, loi do lam chet ca lenh
  ;; ngay truoc khi in. Bo qua loi la an toan: tren Mac in luon
  ;; o tien canh nen khong can dat bien nay; tren Windows loi
  ;; khong xay ra, hanh vi giu nguyen.
  (vl-catch-all-apply 'setvar (list name val))
)

(defun pp-pick-folder (/ shell folder item path f)
  ;; Chọn thư mục lưu PDF. Hủy thì trả nil.
  ;; Cách 1 (Windows): hộp chọn thư mục Shell.Application qua COM.
  ;; Toàn bộ bọc trong catch-all: trên Mac các hàm vlax- không tồn
  ;; tại, lỗi bị bắt lại, path giữ nil để lùi sang cách 2.
  (setq path nil)
  (vl-catch-all-apply
    '(lambda ()
       (setq shell (vlax-create-object "Shell.Application"))
       (if shell
         (progn
           (setq folder (vlax-invoke-method shell 'BrowseForFolder
                          0 "Select folder to save PDFs" 0))
           (vlax-release-object shell)
           (if folder
             (progn
               (setq item (vlax-get-property folder 'Self)
                     path (vlax-get-property item 'Path))
               (vlax-release-object item)
               (vlax-release-object folder)
             )
           )
         )
       )
     )
    nil)
  ;; Cách 2 (Mac, hoặc khi cách 1 không dùng được): getfiled có
  ;; trên cả Windows lẫn Mac — mở hộp chọn file trong thư mục
  ;; muốn lưu, giữ nguyên tên file tạm gợi ý rồi OK; lệnh chỉ lấy
  ;; thư mục chứa file đó, không tạo file thật.
  (if (not path)
    (progn
      (setq f (getfiled "Select output folder: open the folder and click OK (the file name is only a placeholder)"
                        "plotpdf.pdf" "pdf" 1))
      (if f (setq path (vl-filename-directory f)))
    )
  )
  path
)

;; Danh sách rectang đã in được giữ trong biến toàn cục
;; *pp-printed* (mỗi phần tử là 1 khóa do pp-key tạo), sống suốt
;; phiên mở bản vẽ. Cố ý KHÔNG khởi tạo lại biến này khi nạp file,
;; để APPLOAD lại file giữa phiên không làm mất danh sách.

(defun pp-key (en)
  ;; Khóa nhận diện 1 rectang: đường dẫn bản vẽ + handle của entity.
  ;; Handle không đổi trong suốt đời entity (khác ename có thể bị
  ;; tái sử dụng sau khi entity bị xóa).
  (strcat (getvar "DWGPREFIX") (getvar "DWGNAME") "|"
          (cdr (assoc 5 (entget en))))
)

(defun pp-bbox (en / data elev pt x x1 y1 x2 y2 e vd)
  ;; Khung bao của polyline: ((x1 y1) (x2 y2)) = góc dưới-trái và
  ;; góc trên-phải. Tính thuần từ tọa độ đỉnh, thay cho ActiveX
  ;; GetBoundingBox để chạy được trên Mac (Mac không có vla-/vlax-).
  ;; LWPOLYLINE: các điểm group 10 nằm trong entget, thuộc hệ OCS
  ;; nên đổi sang WCS bằng trans với cao độ group 38.
  ;; POLYLINE cũ: điểm 10 của từng VERTEX đã là tọa độ WCS.
  (setq data (entget en) x1 nil)
  (if (= (cdr (assoc 0 data)) "LWPOLYLINE")
    (progn
      (setq elev (cond ((cdr (assoc 38 data))) (0.0)))
      (foreach x data
        (if (= (car x) 10)
          (setq pt (trans (list (cadr x) (caddr x) elev) en 0)
                x1 (if x1 (min x1 (car pt)) (car pt))
                y1 (if y1 (min y1 (cadr pt)) (cadr pt))
                x2 (if x2 (max x2 (car pt)) (car pt))
                y2 (if y2 (max y2 (cadr pt)) (cadr pt)))
        )
      )
    )
    (progn
      (setq e (entnext en))
      (while (and e (= (cdr (assoc 0 (setq vd (entget e)))) "VERTEX"))
        (setq pt (cdr (assoc 10 vd))
              x1 (if x1 (min x1 (car pt)) (car pt))
              y1 (if y1 (min y1 (cadr pt)) (cadr pt))
              x2 (if x2 (max x2 (car pt)) (car pt))
              y2 (if y2 (max y2 (cadr pt)) (cadr pt))
              e (entnext e))
      )
    )
  )
  (list (list x1 y1) (list x2 y2))
)

(defun pp-digit (ch)
  ;; Các nét vẽ của 1 chữ số trên lưới x: 0..2, y: 0..3.
  ;; Mỗi nét là ((x1 y1) (x2 y2)). Dùng để vẽ số thứ tự ảo.
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

(defun pp-mark (x1 y1 x2 y2 n / s len dh unit dw gap tw ox oy i dx sg vecs)
  ;; Vẽ dấu ẢO màu đỏ cho rectang vừa chọn: khung đỏ theo đúng
  ;; khung bao (chính là vùng sẽ in) + số thứ tự n to ở giữa
  ;; (cao bằng 40% chiều cao rectang). Vẽ bằng grvecs — đồ họa
  ;; tạm của AutoCAD, không tạo entity thật; chạy REGEN hoặc
  ;; REDRAW là tự mất. Màu 1 = đỏ.
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
    (foreach sg (pp-digit (substr s (1+ i) 1))
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


;; ============================================================
;; NHÓM HÀM QUÉT VÙNG (pps-) — sao từ PLOTSCAN đã kiểm chứng,
;; đổi tiền tố ps- thành pps- để nạp chung với plotscan.lsp
;; không đụng tên. Hằng số: *pps-scale* chỉ dùng cho kiểm tra
;; bao tổng và báo cáo (tỉ lệ bản vẽ thường 1/100), KHÔNG liên
;; quan tới tỉ lệ in chọn ở khâu in.
;; ============================================================

(setq *pps-scale* 100.0)       ; ti le ban ve cho kiem tra bao tong
(setq *pps-paper-min* 140.0)   ; canh giay nho nhat hop ly (mm giay)
(setq *pps-paper-max* 1250.0)  ; canh giay lon nhat hop ly (mm giay)
(setq *pps-tol* 0.5)           ; dung sai hinh hoc (don vi ban ve)

(defun pps-area (r)
  ;; r = (ename x1 y1 x2 y2 handle) — cùng khuôn rects của PLOTPDF
  (* (- (nth 3 r) (nth 1 r)) (- (nth 4 r) (nth 2 r)))
)

(defun pps-cx (r) (/ (+ (nth 1 r) (nth 3 r)) 2.0))
(defun pps-cy (r) (/ (+ (nth 2 r) (nth 4 r)) 2.0))

(defun pps-contained-p (inner outer / eps)
  (setq eps *pps-tol*)
  (and (>= (nth 1 inner) (- (nth 1 outer) eps))
       (<= (nth 3 inner) (+ (nth 3 outer) eps))
       (>= (nth 2 inner) (- (nth 2 outer) eps))
       (<= (nth 4 inner) (+ (nth 4 outer) eps)))
)

(defun pps-same-bbox-p (a b)
  (and (<= (abs (- (nth 1 a) (nth 1 b))) *pps-tol*)
       (<= (abs (- (nth 2 a) (nth 2 b))) *pps-tol*)
       (<= (abs (- (nth 3 a) (nth 3 b))) *pps-tol*)
       (<= (abs (- (nth 4 a) (nth 4 b))) *pps-tol*))
)

(defun pps-vertices (en data / elev pt pts e vd)
  ;; Đỉnh WCS của polyline, thuần entget như pp-bbox (không
  ;; ActiveX). Bỏ đỉnh cuối nếu trùng đỉnh đầu.
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
  (if (and (> (length pts) 1)
           (<= (abs (- (car (car pts)) (car (last pts)))) *pps-tol*)
           (<= (abs (- (cadr (car pts)) (cadr (last pts)))) *pps-tol*))
    (setq pts (reverse (cdr (reverse pts))))
  )
  pts
)

(defun pps-rect-bbox (pts / x1 y1 x2 y2 ok codes cd pt)
  ;; 4 đỉnh có phải hình chữ nhật thẳng trục không: mỗi đỉnh là
  ;; 1 góc của khung bao và 4 đỉnh phủ đủ 4 góc khác nhau.
  ;; Đạt thì trả khung bao (x1 y1 x2 y2), không thì nil.
  (setq x1 (apply 'min (mapcar 'car pts))
        x2 (apply 'max (mapcar 'car pts))
        y1 (apply 'min (mapcar 'cadr pts))
        y2 (apply 'max (mapcar 'cadr pts))
        ok (and (> (- x2 x1) *pps-tol*) (> (- y2 y1) *pps-tol*))
        codes nil)
  (if ok
    (progn
      (foreach pt pts
        (if (not (and (or (<= (abs (- (car pt) x1)) *pps-tol*)
                          (<= (abs (- (car pt) x2)) *pps-tol*))
                      (or (<= (abs (- (cadr pt) y1)) *pps-tol*)
                          (<= (abs (- (cadr pt) y2)) *pps-tol*))))
          (setq ok nil)
          (setq cd (+ (if (<= (abs (- (car pt) x2)) *pps-tol*) 1 0)
                      (if (<= (abs (- (cadr pt) y2)) *pps-tol*) 2 0))
                codes (if (member cd codes) codes (cons cd codes)))
        )
      )
      (if (/= (length codes) 4) (setq ok nil))
    )
  )
  (if ok (list x1 y1 x2 y2) nil)
)

(defun pps-cmp-area (a b)
  ;; Diện tích giảm dần, hoà thì handle — tie-break duy nhất để
  ;; vl-sort không loại mất phần tử "bằng nhau".
  (cond ((/= (pps-area a) (pps-area b)) (> (pps-area a) (pps-area b)))
        (T (> (nth 5 a) (nth 5 b))))
)

(defun pps-outermost (cands / kept c blocked k)
  ;; Tham lam diện tích giảm dần: giữ rectang không nằm trong
  ;; bất kỳ rectang nào đã giữ.
  (setq kept nil)
  (foreach c (vl-sort cands 'pps-cmp-area)
    (setq blocked nil)
    (foreach k kept
      (if (pps-contained-p c k) (setq blocked T))
    )
    (if (not blocked) (setq kept (append kept (list c))))
  )
  kept
)

(defun pps-plausible-p (r / pw ph)
  ;; Kích thước quy về giấy ở *pps-scale* có hợp lý không.
  (setq pw (/ (- (nth 3 r) (nth 1 r)) *pps-scale*)
        ph (/ (- (nth 4 r) (nth 2 r)) *pps-scale*))
  (and (>= pw *pps-paper-min*) (<= pw *pps-paper-max*)
       (>= ph *pps-paper-min*) (<= ph *pps-paper-max*))
)

(defun pps-children (parent cands / out c)
  (setq out nil)
  (foreach c cands
    (if (and (/= (nth 5 c) (nth 5 parent)) (pps-contained-p c parent))
      (setq out (append out (list c)))
    )
  )
  out
)

;; Chiều sắp xếp suy từ chiều kéo P1 -> P2, đặt trước vl-sort.
(setq *pps-topfirst* T)
(setq *pps-leftfirst* T)

(defun pps-cmp-row (a b)
  (cond ((/= (pps-cy a) (pps-cy b))
         (if *pps-topfirst* (> (pps-cy a) (pps-cy b)) (< (pps-cy a) (pps-cy b))))
        ((/= (pps-cx a) (pps-cx b))
         (if *pps-leftfirst* (< (pps-cx a) (pps-cx b)) (> (pps-cx a) (pps-cx b))))
        (T (> (nth 5 a) (nth 5 b))))
)

(defun pps-cmp-inrow (a b)
  (cond ((/= (pps-cx a) (pps-cx b))
         (if *pps-leftfirst* (< (pps-cx a) (pps-cx b)) (> (pps-cx a) (pps-cx b))))
        ((/= (pps-cy a) (pps-cy b))
         (if *pps-topfirst* (> (pps-cy a) (pps-cy b)) (< (pps-cy a) (pps-cy b))))
        (T (> (nth 5 a) (nth 5 b))))
)

(defun pps-sort-z (frames / avg rowtol sorted rows row anchor out r)
  ;; Chữ Z: nhóm hàng theo tâm Y (dung sai = nửa chiều cao
  ;; khung trung bình), trong hàng xếp theo tâm X.
  (setq avg 0.0)
  (foreach r frames (setq avg (+ avg (- (nth 4 r) (nth 2 r)))))
  (setq rowtol (* 0.5 (/ avg (length frames)))
        sorted (vl-sort frames 'pps-cmp-row)
        rows nil row nil anchor nil)
  (foreach r sorted
    (if (or (not row) (> (abs (- (pps-cy r) anchor)) rowtol))
      (progn
        (if row (setq rows (append rows (list row))))
        (setq row (list r) anchor (pps-cy r))
      )
      (setq row (append row (list r)))
    )
  )
  (if row (setq rows (append rows (list row))))
  (setq out nil)
  (foreach row rows
    (setq out (append out (vl-sort row 'pps-cmp-inrow)))
  )
  out
)

(defun pps-paper-for (w h denom / fl fs papers p result)
  ;; Khổ giấy ISO nhỏ nhất (A4 -> A0) mà khung w x h in ở tỉ lệ
  ;; 1/denom vừa được, đã trừ lề 5mm mỗi phía. Không khổ nào
  ;; vừa thì trả nil. Tên khổ theo đúng chuỗi DWG To PDF.pc3
  ;; như khổ A4 đang dùng trong pp-plot-one.
  (setq fl (/ (max w h) denom)
        fs (/ (min w h) denom)
        papers '(("ISO A4 (297.00 x 210.00 MM)" 297.0 210.0)
                 ("ISO A3 (420.00 x 297.00 MM)" 420.0 297.0)
                 ("ISO A2 (594.00 x 420.00 MM)" 594.0 420.0)
                 ("ISO A1 (841.00 x 594.00 MM)" 841.0 594.0)
                 ("ISO A0 (1189.00 x 841.00 MM)" 1189.0 841.0))
        result nil)
  (foreach p papers
    (if (and (not result)
             (<= (+ fl 10.0) (nth 1 p))
             (<= (+ fs 10.0) (nth 2 p)))
      (setq result (car p))
    )
  )
  result
)

(defun pps-scale-str (denom)
  ;; Chuỗi tỉ lệ cho -PLOT: "1=100" cho tỉ lệ 1/100.
  (if (= denom (float (fix denom)))
    (strcat "1=" (itoa (fix denom)))
    (strcat "1=" (rtos denom 2 2)))
)

(defun pps-scan (/ p1u p2u p1 p2 ss total i en data typ pts bb rec
                  nnotpoly nnotclosed nnot4 nnotrect cands dedup dup
                  kept containers round changed newkept k childs sub
                  plaus ordered out skipped conf s blocked d r)
  ;; Quét 1 vùng P1 -> P2, trả danh sách rects đã sắp xếp đúng
  ;; khuôn của PLOTPDF (ename x1 y1 x2 y2 handle), đã lọc bỏ
  ;; rectang in rồi ở lần chạy trước, đã đánh dấu ảo và đã hỏi
  ;; xác nhận in. Hủy/không có khung thì trả nil.
  (setq p1u (getpoint "\nPick first corner P1 of the scan region: "))
  (if p1u (setq p2u (getcorner p1u "\nPick opposite corner P2: ")))
  (if (or (not p1u) (not p2u))
    (progn (princ "\nRegion selection cancelled.") nil)
    (progn
      (setq p1 (trans p1u 1 0)
            p2 (trans p2u 1 0)
            *pps-leftfirst* (<= (car p1) (car p2))
            *pps-topfirst* (>= (cadr p1) (cadr p2)))
      ;; Quét Crossing + phân loại + chuẩn hoá
      (setq ss (ssget "_C" p1u p2u)
            total 0 nnotpoly 0 nnotclosed 0 nnot4 0 nnotrect 0
            cands nil)
      (if ss
        (progn
          (setq total (sslength ss) i 0)
          (while (< i total)
            (setq en (ssname ss i) i (1+ i))
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
                    (setq pts (pps-vertices en data))
                    (cond
                      ((/= (length pts) 4)
                       (setq nnot4 (1+ nnot4)))
                      ((not (setq bb (pps-rect-bbox pts)))
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
      ;; Khử trùng khít
      (setq dedup nil dup 0)
      (foreach rec cands
        (setq blocked nil)
        (foreach d dedup
          (if (pps-same-bbox-p rec d) (setq blocked T))
        )
        (if blocked
          (setq dup (1+ dup))
          (setq dedup (append dedup (list rec)))
        )
      )
      ;; Rectang ngoài cùng + bóc rectang bao tổng (tối đa 3 vòng)
      (setq kept (pps-outermost dedup) containers 0 round 0 changed T)
      (while (and changed (< round 3))
        (setq round (1+ round) changed nil newkept nil)
        (foreach k kept
          (setq childs (pps-children k dedup)
                sub (pps-outermost childs)
                plaus nil)
          (foreach s sub
            (if (pps-plausible-p s) (setq plaus (append plaus (list s))))
          )
          (if (>= (length plaus) 2)
            (progn
              (setq containers (1+ containers) changed T
                    newkept (append newkept plaus))
              (princ (strcat "\nWarning: 1 super-container rectangle removed (it contained "
                             (itoa (length plaus)) " plausible frame(s))."))
            )
            (setq newkept (append newkept (list k)))
          )
        )
        (setq kept newkept)
      )
      ;; Sắp xếp chữ Z, lọc rectang đã in ở lần chạy trước
      (setq ordered (if kept (pps-sort-z kept) nil)
            out nil skipped 0)
      (foreach r ordered
        (if (member (pp-key (car r)) *pp-printed*)
          (setq skipped (1+ skipped))
          (setq out (append out (list r)))
        )
      )
      (setq ordered out)
      ;; Đánh dấu ảo theo đúng thứ tự sẽ in
      (setq i 0)
      (foreach r ordered
        (setq i (1+ i))
        (vl-catch-all-apply 'pp-mark
          (list (nth 1 r) (nth 2 r) (nth 3 r) (nth 4 r) i))
      )
      ;; Báo cáo tóm tắt
      (princ (strcat "\nScan: touched " (itoa total) " object(s) | valid rectangles "
                     (itoa (length cands)) " | duplicates " (itoa dup)
                     " | not a closed rectangle/polyline: "
                     (itoa (+ nnotpoly nnotclosed nnot4 nnotrect))
                     " | super-containers removed " (itoa containers)
                     " | already printed, skipped " (itoa skipped)))
      (princ (strcat "\n>>> Found " (itoa (length ordered)) " frame(s) to print."))
      (if (not ordered)
        nil
        (progn
          (initget "Yes No")
          (setq conf (getkword (strcat "\nPrint " (itoa (length ordered))
                                       " frame(s) found? [Yes/No] <Yes>: ")))
          (if (= conf "No")
            (progn
              (princ "\nPrinting cancelled. The virtual marks stay on screen for review (REGEN to clear).")
              nil
            )
            ordered
          )
        )
      )
    )
  )
)

(defun pp-plot-one (x1 y1 x2 y2 fpath paper scaleans)
  ;; In 1 rectang ra PDF bằng -PLOT chi tiết. Chuỗi đáp án theo
  ;; đúng thứ tự prompt của AutoCAD 2022 (model space):
  ;;   Detailed? Yes -> layout: hiện tại -> thiết bị -> khổ giấy ->
  ;;   đơn vị giấy -> hướng giấy (theo chiều rectang) -> in ngược?
  ;;   No -> vùng in: Window -> góc dưới-trái -> góc trên-phải ->
  ;;   tỷ lệ: Fit -> offset: Center -> plot style? Yes -> bảng
  ;;   style -> lineweights? Yes -> shade plot: As displayed ->
  ;;   tên file -> Save changes? No -> Proceed? Yes.
  ;; (Prompt "Scale lineweights" chỉ có ở layout, model không hỏi;
  ;; prompt "Write plot to a file?" không có với máy in PDF.)
  ;; Trả mã: 0 = đã tạo được file, 2 = không tạo được file.
  ;; Xóa file cũ cùng tên trước để bước kiểm chứng file mới tin cậy.
  (if (findfile fpath) (vl-file-delete fpath))
  (vl-catch-all-apply
    '(lambda ()
       (command "_.-PLOT" "_Yes" ""
                "DWG To PDF - NO PREVIEW.pc3"
                paper
                "_Millimeters"
                (if (> (- x2 x1) (- y2 y1)) "_Landscape" "_Portrait")
                "_No"
                "_Window" (list x1 y1) (list x2 y2)
                scaleans "_Center"
                "_Yes" "monochrome.ctb" "_Yes"
                ""
                fpath "_No" "_Yes")
     )
    nil)
  (if (vl-file-systime fpath) 0 2)
)

(defun c:PLOTPDF (/ *error* ent i en data mn mx bb sep rects notclosed
                   folder dwgbase pad bg fd r res ok fail vctr vsize fpath
                   go mode smode denom paper scaleans note w h)
  (defun *error* (msg)
    (if bg (pp-setvar "BACKGROUNDPLOT" bg))
    (if fd (pp-setvar "FILEDIA" fd))
    (if vctr
      (vl-catch-all-apply
        '(lambda () (command "_.ZOOM" "_C" vctr vsize)) nil)
    )
    (princ (strcat "\nCancelled. Error: " msg))
    (princ)
  )
  (setq go T)

  ;; --- Kiểm tra không gian làm việc: model space hoặc paper space
  ;; đều được. Chỉ chặn trường hợp đang ở trong viewport của layout,
  ;; vì lúc đó tọa độ cửa sổ in sẽ sai. ---
  (if (and (= (getvar "TILEMODE") 0) (> (getvar "CVPORT") 1))
    (progn
      (princ "\nYou are inside a viewport - exit to paper space and run again.")
      (setq go nil)
    )
  )

  (if go
    (progn
      ;; --- Chọn rectang: click từng cái một để giữ đúng thứ tự chọn.
      ;; (ssget không giữ thứ tự click — nó trả theo thứ tự database.) ---
      (setq rects nil notclosed 0)
      (initget "Pick Scan")
      (setq mode (getkword "\nSelect frames by [Pick/Scan] <Pick>: "))
      (if (not mode) (setq mode "Pick"))
      (if (= mode "Scan")
        (setq rects (pps-scan))
        (progn
      (while (setq ent (entsel "\nClick rectangles in print order (Enter to finish): "))
        (setq en (car ent)
              data (entget en))
        (cond
          ((not (member (cdr (assoc 0 data)) '("LWPOLYLINE" "POLYLINE")))
           (princ "\nSelected object is not a polyline - skipped, keep picking."))
          ((/= 1 (logand 1 (cdr (assoc 70 data))))
           (setq notclosed (1+ notclosed))
           (princ "\nPolyline is not closed - skipped, keep picking."))
          ((member en (mapcar 'car rects))
           (princ "\nThis rectangle was already selected - skipped, keep picking."))
          ((member (pp-key en) *pp-printed*)
           (princ "\nThis rectangle was already printed in a previous run - skipped, keep picking."))
          (T
           (setq bb (pp-bbox en)
                 mn (car bb)
                 mx (cadr bb))
           (setq rects (append rects
                               (list (list en (car mn) (cadr mn)
                                           (car mx) (cadr mx)))))
           ;; Đánh dấu ảo: khung đỏ + số thứ tự, để thấy đã chọn
           (vl-catch-all-apply 'pp-mark
             (list (car mn) (cadr mn) (car mx) (cadr mx) (length rects)))
           (princ (strcat "\nSelected " (itoa (length rects)) " rectangle(s)."))
          )
        )
      )
        ) ; het progn cua che do TungCai
      ) ; het if che do chon
      (if (not rects)
        (if (= mode "Pick") (princ "\nNo rectangle selected."))
        (progn
          ;; --- Chọn thư mục lưu (mỗi lần chạy chọn lại) ---
          (setq folder (vl-catch-all-apply 'pp-pick-folder nil))
          (if (or (vl-catch-all-error-p folder) (not folder))
            (princ "\nFolder selection cancelled.")
            (progn
              ;; Lưu khung nhìn hiện tại để trả lại sau khi in,
              ;; tránh màn hình bị nhảy khi hoàn tất lệnh
              (setq vctr (getvar "VIEWCTR")
                    vsize (getvar "VIEWSIZE"))
              ;; --- Option tỉ lệ in: Fit (như cũ) hoặc Tile (tỉ lệ
              ;; cố định 1/N, khổ giấy tự chọn theo từng khung) ---
              (initget "Fit Scale")
              (setq smode (getkword "\nPlot scale [Fit/Scale] <Fit>: "))
              (if (not smode) (setq smode "Fit"))
              (if (= smode "Scale")
                (progn
                  (setq denom (getreal "\nScale denominator for 1/N <100>: "))
                  (if (or (not denom) (<= denom 0)) (setq denom 100.0))
                )
              )
              ;; --- In từng rectang theo thứ tự đã chọn ---
              (setq dwgbase (vl-filename-base (getvar "DWGNAME"))
                    pad (strlen (itoa (length rects)))
                    bg (pp-getvar "BACKGROUNDPLOT")
                    fd (pp-getvar "FILEDIA"))
              ;; In tiền cảnh + tắt hộp thoại chọn file để -PLOT
              ;; nhận tên file ngay trên dòng lệnh
              (pp-setvar "BACKGROUNDPLOT" 0)
              (pp-setvar "FILEDIA" 0)
              (setq ok 0 fail 0 i 0)
              (foreach r rects
                (setq i (1+ i)
                      sep (if (vl-string-search "\\" folder) "\\" "/")
                      fpath (strcat folder
                                    (if (member (substr folder (strlen folder) 1)
                                                '("\\" "/"))
                                      "" sep)
                                    dwgbase "_" (pp-pad i pad) ".pdf"))
                (setq w (- (nth 3 r) (nth 1 r))
                      h (- (nth 4 r) (nth 2 r))
                      paper "ISO A4 (297.00 x 210.00 MM)"
                      scaleans "_Fit"
                      note "")
                (if (= smode "Scale")
                  (progn
                    (setq scaleans (pps-scale-str denom)
                          paper (pps-paper-for w h denom))
                    (if (not paper)
                      (setq paper "ISO A0 (1189.00 x 841.00 MM)"
                            scaleans "_Fit"
                            note " (frame larger than A0 at this scale - fitted to A0)")
                    )
                  )
                )
                (setq res (vl-catch-all-apply
                            'pp-plot-one
                            (list (nth 1 r) (nth 2 r)
                                  (nth 3 r) (nth 4 r) fpath paper scaleans)))
                (cond
                  ((vl-catch-all-error-p res)
                   (setq fail (1+ fail)))
                  ((= res 0)
                   (setq ok (1+ ok))
                   ;; Ghi nhớ rectang này đã in, lần chạy sau bỏ qua
                   (setq *pp-printed* (cons (pp-key (car r)) *pp-printed*))
                   (princ (strcat "\n  " dwgbase "_" (pp-pad i pad)
                                  ".pdf - " (itoa (vl-file-size fpath))
                                  " bytes"
                                  (if (<= (vl-file-size fpath) 1353)
                                    " (blank page?)" "") note)))
                  (T (setq fail (1+ fail)))
                )
              )
              (pp-setvar "BACKGROUNDPLOT" bg)
              (pp-setvar "FILEDIA" fd)
              ;; --- Báo cáo ---
              (princ (strcat "\nPrinted " (itoa ok) "/" (itoa (length rects))
                             " file(s) to folder: " folder))
              (if (> notclosed 0)
                (princ (strcat "\nSkipped " (itoa notclosed)
                               " non-closed polyline(s)."))
              )
              (if (> fail 0)
                (princ (strcat "\n" (itoa fail)
                               " file(s) failed - see the command line above for details."))
              )
              ;; Trả lại khung nhìn như trước khi in
              (if vctr
                (vl-catch-all-apply
                  '(lambda () (command "_.ZOOM" "_C" vctr vsize)) nil)
              )
            )
          )
        )
      )
    )
  )
  (princ)
)

(defun c:PLOTPDFRESET ()
  ;; Xóa danh sách rectang đã in, để chọn in lại từ đầu.
  (setq *pp-printed* nil)
  (princ "\nPrinted list cleared - you can select and print everything again.")
  (princ)
)

(princ "\nPLOTPDF loaded - run PLOTPDF, choose Pick (click each rectangle) or Scan (pick P1->P2 to find frames in bulk), choose a folder, choose Fit or Scale (fixed ratio), then print. Run PLOTPDFRESET to clear the printed list.")
(princ)
