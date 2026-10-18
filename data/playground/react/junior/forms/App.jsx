const { useState } = React;

const STEPS = ['Tài khoản', 'Hồ sơ', 'Xác nhận'];

function validate(step, form) {
  const e = {};
  if (step === 0) {
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email chưa đúng định dạng';
    if (form.password.length < 8) e.password = 'Mật khẩu tối thiểu 8 ký tự';
  }
  if (step === 1) {
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.level) e.level = 'Chọn trình độ hiện tại';
  }
  return e;
}

function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error && <small className="err">{error}</small>}
    </label>
  );
}

function RegisterWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ email: '', password: '', name: '', level: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const next = e => {
    e.preventDefault();
    const found = validate(step, form);
    setErrors(found);
    if (Object.keys(found).length) return;
    if (step < STEPS.length - 1) setStep(step + 1);
    else setDone(true);
  };

  if (done) {
    return <div className="panel"><h2>Chào mừng, {form.name}!</h2><p className="muted">Tài khoản {form.email} đã được tạo.</p></div>;
  }

  return (
    <form className="panel stack" onSubmit={next} noValidate>
      <ol className="steps">
        {STEPS.map((s, i) => <li key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>{s}</li>)}
      </ol>

      {step === 0 && (
        <>
          <Field label="Email" error={errors.email}>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </Field>
          <Field label="Mật khẩu" error={errors.password}>
            <input name="password" type="password" value={form.password} onChange={handleChange} />
          </Field>
        </>
      )}

      {step === 1 && (
        <>
          <Field label="Họ tên" error={errors.name}>
            <input name="name" value={form.name} onChange={handleChange} />
          </Field>
          <Field label="Trình độ" error={errors.level}>
            <select name="level" value={form.level} onChange={handleChange}>
              <option value="">-- Chọn --</option>
              <option>Newbie</option>
              <option>Junior</option>
              <option>Mid</option>
            </select>
          </Field>
        </>
      )}

      {step === 2 && (
        <dl className="summary">
          <dt>Email</dt><dd>{form.email}</dd>
          <dt>Họ tên</dt><dd>{form.name}</dd>
          <dt>Trình độ</dt><dd>{form.level}</dd>
        </dl>
      )}

      <div className="row">
        {step > 0 && <button type="button" className="ghost" onClick={() => setStep(step - 1)}>Quay lại</button>}
        <button type="submit">{step === STEPS.length - 1 ? 'Hoàn tất' : 'Tiếp tục'}</button>
      </div>
    </form>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<RegisterWizard />);
