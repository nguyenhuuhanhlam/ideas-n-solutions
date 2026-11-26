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
;;; - Khung nhìn (view) được giữ nguyên như trước khi chạy lệnh.
;;; - Rectang trên layer khóa vẫn in bình thường (in không sửa entity).
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

(vl-load-com)

(defun pp-pad (i width / s)
  ;; Đệm số 0 ở trước: 1 -> "01" khi width = 2
  (setq s (itoa i))
  (while (< (strlen s) width)
    (setq s (strcat "0" s))
  )
  s
)

(defun pp-pick-folder (/ shell folder item path)
  ;; Hộp chọn thư mục của Windows. Hủy thì trả nil.
  (setq shell (vlax-create-object "Shell.Application"))
  (if shell
    (progn
      (setq folder (vlax-invoke-method shell 'BrowseForFolder
                     0 "Chon thu muc luu PDF" 0))
      (vlax-release-object shell)
      (if folder
        (progn
          (setq item (vlax-get-property folder 'Self)
                path (vlax-get-property item 'Path))
          (vlax-release-object item)
          (vlax-release-object folder)
          path
        )
      )
    )
  )
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

(defun pp-plot-one (x1 y1 x2 y2 fpath)
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
                "ISO A4 (297.00 x 210.00 MM)"
                "_Millimeters"
                (if (> (- x2 x1) (- y2 y1)) "_Landscape" "_Portrait")
                "_No"
                "_Window" (list x1 y1) (list x2 y2)
                "_Fit" "_Center"
                "_Yes" "monochrome.ctb" "_Yes"
                ""
                fpath "_No" "_Yes")
     )
    nil)
  (if (vl-file-systime fpath) 0 2)
)

(defun c:PLOTPDF (/ *error* ent i en data mn mx rects notclosed
                   folder dwgbase pad bg fd r res ok fail vctr vsize fpath
                   go)
  (defun *error* (msg)
    (if bg (setvar "BACKGROUNDPLOT" bg))
    (if fd (setvar "FILEDIA" fd))
    (if vctr
      (vl-catch-all-apply
        '(lambda () (command "_.ZOOM" "_C" vctr vsize)) nil)
    )
    (princ (strcat "\nDa huy. Loi: " msg))
    (princ)
  )
  (setq go T)

  ;; --- Kiểm tra không gian làm việc: model space hoặc paper space
  ;; đều được. Chỉ chặn trường hợp đang ở trong viewport của layout,
  ;; vì lúc đó tọa độ cửa sổ in sẽ sai. ---
  (if (and (= (getvar "TILEMODE") 0) (> (getvar "CVPORT") 1))
    (progn
      (princ "\nDang o trong viewport — hay thoat ra paper space roi chay lai.")
      (setq go nil)
    )
  )

  (if go
    (progn
      ;; --- Chọn rectang: click từng cái một để giữ đúng thứ tự chọn.
      ;; (ssget không giữ thứ tự click — nó trả theo thứ tự database.) ---
      (setq rects nil notclosed 0)
      (while (setq ent (entsel "\nClick rectang theo thu tu in (Enter de ket thuc chon): "))
        (setq en (car ent)
              data (entget en))
        (cond
          ((not (member (cdr (assoc 0 data)) '("LWPOLYLINE" "POLYLINE")))
           (princ "\nDoi tuong vua chon khong phai polyline — bo qua, chon tiep."))
          ((/= 1 (logand 1 (cdr (assoc 70 data))))
           (setq notclosed (1+ notclosed))
           (princ "\nPolyline khong khop kin — bo qua, chon tiep."))
          ((member en (mapcar 'car rects))
           (princ "\nRectang nay da chon roi — bo qua, chon tiep."))
          ((member (pp-key en) *pp-printed*)
           (princ "\nRectang nay da in roi o lan chay truoc — bo qua, chon tiep."))
          (T
           (vla-GetBoundingBox (vlax-ename->vla-object en) 'mn 'mx)
           (setq mn (vlax-safearray->list mn)
                 mx (vlax-safearray->list mx))
           (setq rects (append rects
                               (list (list en (car mn) (cadr mn)
                                           (car mx) (cadr mx)))))
           ;; Đánh dấu ảo: khung đỏ + số thứ tự, để thấy đã chọn
           (vl-catch-all-apply 'pp-mark
             (list (car mn) (cadr mn) (car mx) (cadr mx) (length rects)))
           (princ (strcat "\nDa chon " (itoa (length rects)) " rectang."))
          )
        )
      )
      (if (not rects)
        (princ "\nChua chon rectang nao.")
        (progn
          ;; --- Chọn thư mục lưu (mỗi lần chạy chọn lại) ---
          (setq folder (vl-catch-all-apply 'pp-pick-folder nil))
          (if (or (vl-catch-all-error-p folder) (not folder))
            (princ "\nDa huy chon thu muc.")
            (progn
              ;; Lưu khung nhìn hiện tại để trả lại sau khi in,
              ;; tránh màn hình bị nhảy khi hoàn tất lệnh
              (setq vctr (getvar "VIEWCTR")
                    vsize (getvar "VIEWSIZE"))
              ;; --- In từng rectang theo thứ tự đã chọn ---
              (setq dwgbase (vl-filename-base (getvar "DWGNAME"))
                    pad (strlen (itoa (length rects)))
                    bg (getvar "BACKGROUNDPLOT")
                    fd (getvar "FILEDIA"))
              ;; In tiền cảnh + tắt hộp thoại chọn file để -PLOT
              ;; nhận tên file ngay trên dòng lệnh
              (setvar "BACKGROUNDPLOT" 0)
              (setvar "FILEDIA" 0)
              (setq ok 0 fail 0 i 0)
              (foreach r rects
                (setq i (1+ i)
                      fpath (strcat folder
                                    (if (= (substr folder (strlen folder) 1) "\\")
                                      "" "\\")
                                    dwgbase "_" (pp-pad i pad) ".pdf"))
                (setq res (vl-catch-all-apply
                            'pp-plot-one
                            (list (nth 1 r) (nth 2 r)
                                  (nth 3 r) (nth 4 r) fpath)))
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
                                    " (trang trang?)" ""))))
                  (T (setq fail (1+ fail)))
                )
              )
              (setvar "BACKGROUNDPLOT" bg)
              (setvar "FILEDIA" fd)
              ;; --- Báo cáo ---
              (princ (strcat "\nDa in " (itoa ok) "/" (itoa (length rects))
                             " file vao thu muc: " folder))
              (if (> notclosed 0)
                (princ (strcat "\nBo qua " (itoa notclosed)
                               " polyline khong khop kin."))
              )
              (if (> fail 0)
                (princ (strcat "\n" (itoa fail)
                               " file in loi — xem dong lenh phia tren de biet ly do."))
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
  (princ "\nDa xoa danh sach rectang da in — co the chon in lai tu dau.")
  (princ)
)

(princ "\nDa nap PLOTPDF — go PLOTPDF, click chon rectang theo thu tu roi chon thu muc; lenh in bang -PLOT chi tiet theo cau hinh da dat truoc. Go PLOTPDFRESET neu muon xoa danh sach rectang da in.")
(princ)
