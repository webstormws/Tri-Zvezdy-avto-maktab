import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";
import Modal from "./Modal";
import { api } from "../../services/api";
import { useToast } from "../../context/ToastContext";

const EnrollmentContext = createContext(null);

export function EnrollmentProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [preselectedCourse, setPreselectedCourse] = useState(null);

  const openEnrollment = useCallback((courseSlug) => {
    setPreselectedCourse(courseSlug || null);
    setOpen(true);
  }, []);
  const closeEnrollment = useCallback(() => setOpen(false), []);

  return (
    <EnrollmentContext.Provider value={{ open, openEnrollment, closeEnrollment, preselectedCourse }}>
      {children}
      <EnrollmentModal />
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const ctx = useContext(EnrollmentContext);
  if (!ctx) throw new Error("useEnrollment must be used within EnrollmentProvider");
  return ctx;
}

function EnrollmentModal() {
  const { open, closeEnrollment, preselectedCourse } = useEnrollment();
  const toast = useToast();
  const [courses, setCourses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    course: "",
    branch: "",
    comment: "",
  });

  useEffect(() => {
    if (!open) return;
    let active = true;
    setLoading(true);
    Promise.all([api.courses(), api.branches()])
      .then(([c, b]) => {
        if (!active) return;
        setCourses(c.results || c);
        setBranches(b.results || b);
        const match = (c.results || c).find((x) => x.slug === preselectedCourse);
        if (match) setForm((f) => ({ ...f, course: match.id }));
      })
      .catch(() => toast.error("Xatolik", "Kurslar yuklab bo'lmadi."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [open, preselectedCourse, toast]);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: null }));
  };

  const validate = () => {
    const er = {};
    if (!form.first_name.trim()) er.first_name = "Ismni kiriting";
    if (!form.phone.trim()) er.phone = "Telefon raqamini kiriting";
    if (!form.course) er.course = "Kursni tanlang";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await api.createApplication(form);
      toast.success("Ariza qabul qilindi!", "Tez orada siz bilan bog'lanamiz.");
      setForm({ first_name: "", last_name: "", phone: "", course: "", branch: "", comment: "" });
      closeEnrollment();
    } catch (err) {
      toast.error("Yuborilmadi", err.friendlyMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={closeEnrollment} title="Kursga yozilish" maxWidth="max-w-xl">
      {loading ? (
        <div className="space-y-4 py-2">
          <div className="skeleton h-11 w-full" />
          <div className="skeleton h-11 w-full" />
          <div className="skeleton h-11 w-full" />
          <div className="skeleton h-11 w-full" />
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="input-label" htmlFor="enr-first">Ism *</label>
              <input id="enr-first" className="input-field" placeholder="Ismingiz" value={form.first_name} onChange={set("first_name")} />
              {errors.first_name && <p className="mt-1 text-xs font-medium text-red-500">{errors.first_name}</p>}
            </div>
            <div>
              <label className="input-label" htmlFor="enr-last">Familiya</label>
              <input id="enr-last" className="input-field" placeholder="Familiyangiz" value={form.last_name} onChange={set("last_name")} />
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="enr-phone">Telefon *</label>
            <input id="enr-phone" className="input-field" type="tel" placeholder="99 007 71 70" value={form.phone} onChange={set("phone")} />
            {errors.phone && <p className="mt-1 text-xs font-medium text-red-500">{errors.phone}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="input-label" htmlFor="enr-course">Kurs *</label>
              <select id="enr-course" className="input-field" value={form.course} onChange={set("course")}>
                <option value="">Kursni tanlang</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} — {c.short_description}
                  </option>
                ))}
              </select>
              {errors.course && <p className="mt-1 text-xs font-medium text-red-500">{errors.course}</p>}
            </div>
            <div>
              <label className="input-label" htmlFor="enr-branch">Filial</label>
              <select id="enr-branch" className="input-field" value={form.branch} onChange={set("branch")}>
                <option value="">Filialni tanlang</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="input-label" htmlFor="enr-comment">Izoh</label>
            <textarea id="enr-comment" className="input-field min-h-[90px] resize-y" placeholder="Qo'shimcha ma'lumot" value={form.comment} onChange={set("comment")} />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {submitting ? "Yuborilmoqda..." : "Arizani yuborish"}
          </button>
        </form>
      )}
    </Modal>
  );
}
