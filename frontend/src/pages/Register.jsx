import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, UserPlus, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { usePageMeta } from "../utils/seo";
import Logo from "../components/layout/Logo";

export default function Register() {
  usePageMeta("Ro'yxatdan o'tish", "Yangi hisob yarating.");
  const { user, loading, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/15 border-t-primary" />
      </section>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((er) => ({ ...er, [key]: null, _form: null }));
  };

  const validate = () => {
    const er = {};
    if (!form.username.trim()) er.username = "Usernameni kiriting";
    else if (form.username.trim().length < 3) er.username = "Kamida 3 ta belgi";
    if (!form.password) er.password = "Parolni kiriting";
    else if (form.password.length < 6) er.password = "Parol kamida 6 ta belgi bo'lsin";
    if (!form.confirm) er.confirm = "Parolni qayta kiriting";
    else if (form.confirm !== form.password) er.confirm = "Parollar mos emas";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const u = await register({
        username: form.username.trim(),
        password: form.password,
      });
      toast.success("Ro'yxatdan o'tdingiz!", "Xush kelibsiz, " + u.username + "!");
      navigate("/");
    } catch (err) {
      setErrors((er) => ({ ...er, _form: err.friendlyMessage || "Ro'yxatdan o'tib bo'lmadi." }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-surface px-4 py-12">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/[0.05]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-primary/[0.05]" />
      <div className="card relative w-full max-w-md animate-fade-up p-8 sm:p-10">
        <div className="mb-8 flex justify-center">
          <Logo size={52} />
        </div>
        <h1 className="text-center text-2xl font-extrabold uppercase tracking-tight text-ink">
          Ro'yxatdan o'tish
        </h1>
        <p className="mt-2 text-center text-sm text-ink/55">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="font-bold text-primary hover:text-primary-light">
            Hisobga kirish
          </Link>
        </p>

        {errors._form && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {errors._form}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-5" noValidate>
          <div>
            <label className="input-label" htmlFor="rg-username">Username *</label>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                id="rg-username"
                className="input-field !pl-11"
                placeholder="username"
                autoComplete="username"
                value={form.username}
                onChange={set("username")}
              />
            </div>
            {errors.username && <p className="mt-1 text-xs font-medium text-red-500">{errors.username}</p>}
          </div>

          <div>
            <label className="input-label" htmlFor="rg-password">Parol *</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                id="rg-password"
                className="input-field !pl-11 !pr-11"
                type={showPass ? "text" : "password"}
                placeholder="Kamida 6 ta belgi"
                autoComplete="new-password"
                value={form.password}
                onChange={set("password")}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink/40 transition-colors hover:text-ink"
                aria-label={showPass ? "Parolni yashirish" : "Parolni ko'rsatish"}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="input-label" htmlFor="rg-confirm">Parolni qayta kiriting *</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                id="rg-confirm"
                className="input-field !pl-11"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                autoComplete="new-password"
                value={form.confirm}
                onChange={set("confirm")}
              />
            </div>
            {errors.confirm && <p className="mt-1 text-xs font-medium text-red-500">{errors.confirm}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            {submitting ? "Yaratilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>
      </div>
    </section>
  );
}
