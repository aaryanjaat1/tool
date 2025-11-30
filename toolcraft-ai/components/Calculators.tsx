import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { GlassCard, NeonButton, InputGroup } from './UI';
import { RefreshCw, Copy, Check } from 'lucide-react';

// --- BMI Calculator ---
export const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (w > 0 && h > 0) {
      const val = w / ((h / 100) * (h / 100));
      setBmi(parseFloat(val.toFixed(1)));
    }
  };

  const getCategory = (val: number) => {
    if (val < 18.5) return { label: 'Underweight', color: 'text-yellow-600 dark:text-yellow-400' };
    if (val < 24.9) return { label: 'Normal', color: 'text-green-600 dark:text-green-400' };
    if (val < 29.9) return { label: 'Overweight', color: 'text-orange-600 dark:text-orange-400' };
    return { label: 'Obese', color: 'text-red-600 dark:text-red-500' };
  };

  return (
    <GlassCard title="BMI Calculator" className="h-full flex flex-col">
      <div className="space-y-4 flex-grow">
        <InputGroup label="Weight (kg)" id="bmi-weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <InputGroup label="Height (cm)" id="bmi-height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        <NeonButton onClick={calculate} className="w-full mt-4">Calculate BMI</NeonButton>
      </div>
      {bmi !== null && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-center animate-pulse-slow">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Your BMI</p>
          <div className="text-4xl font-bold text-slate-800 dark:text-white my-2">{bmi}</div>
          <p className={`font-semibold ${getCategory(bmi).color}`}>{getCategory(bmi).label}</p>
        </div>
      )}
    </GlassCard>
  );
};

// --- EMI Calculator ---
export const EMICalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('500000');
  const [rate, setRate] = useState<string>('10');
  const [years, setYears] = useState<string>('5');
  const [result, setResult] = useState<{ emi: number; totalInterest: number; totalPayment: number } | null>(null);

  const calculate = () => {
    const p = parseFloat(amount);
    const r = parseFloat(rate) / 12 / 100;
    const n = parseFloat(years) * 12;

    if (p && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPayment = emi * n;
      const totalInterest = totalPayment - p;
      setResult({
        emi: Math.round(emi),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(totalPayment)
      });
    }
  };

  const data = result ? [
    { name: 'Principal', value: parseFloat(amount) },
    { name: 'Interest', value: result.totalInterest },
  ] : [];

  const COLORS = ['#00f3ff', '#bc13fe'];

  return (
    <GlassCard title="EMI Calculator" className="h-full flex flex-col">
       <div className="space-y-4">
        <InputGroup label="Loan Amount ($)" id="emi-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <InputGroup label="Interest Rate (%)" id="emi-rate" type="number" value={rate} onChange={(e) => setRate(e.target.value)} />
        <InputGroup label="Tenure (Years)" id="emi-years" type="number" value={years} onChange={(e) => setYears(e.target.value)} />
        <NeonButton onClick={calculate} className="w-full">Calculate EMI</NeonButton>
      </div>
      {result && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
             <div className="text-left">
                <p className="text-gray-500 dark:text-gray-400 text-xs">Monthly EMI</p>
                <p className="text-xl font-bold text-neonBlue">${result.emi.toLocaleString()}</p>
             </div>
             <div className="text-right">
                <p className="text-gray-500 dark:text-gray-400 text-xs">Total Interest</p>
                <p className="text-xl font-bold text-neonPurple">${result.totalInterest.toLocaleString()}</p>
             </div>
          </div>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '12px' }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

// --- Age Calculator ---
export const AgeCalculator: React.FC = () => {
  const [dob, setDob] = useState<string>('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculate = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    setAge({ years, months, days });
  };

  return (
    <GlassCard title="Age Calculator" className="h-full">
      <div className="space-y-4">
        <InputGroup label="Date of Birth" id="age-dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} max={new Date().toISOString().split('T')[0]} />
        <NeonButton onClick={calculate} className="w-full">Calculate Age</NeonButton>
      </div>
      {age && (
        <div className="mt-8 grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10">
            <div className="text-2xl font-bold text-neonBlue">{age.years}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Years</div>
          </div>
          <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10">
            <div className="text-2xl font-bold text-neonPurple">{age.months}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Months</div>
          </div>
          <div className="bg-slate-100 dark:bg-white/5 p-3 rounded-lg border border-slate-200 dark:border-white/10">
            <div className="text-2xl font-bold text-green-500 dark:text-green-400">{age.days}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Days</div>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

// --- GST Calculator ---
export const GSTCalculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [gst, setGst] = useState<string>('18');
  const [result, setResult] = useState<{ gstAmount: number; total: number } | null>(null);

  const calculate = () => {
    const a = parseFloat(amount);
    const g = parseFloat(gst);
    if (a && g) {
      const gstVal = (a * g) / 100;
      setResult({ gstAmount: gstVal, total: a + gstVal });
    }
  };

  return (
    <GlassCard title="GST Calculator" className="h-full">
      <div className="space-y-4">
        <InputGroup label="Original Amount" id="gst-amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-gray-300 mb-1">GST Slab</label>
          <select
            value={gst}
            onChange={(e) => setGst(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-neonBlue outline-none"
          >
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>
        </div>
        <NeonButton onClick={calculate} className="w-full">Calculate Tax</NeonButton>
      </div>
      {result && (
        <div className="mt-6 space-y-3">
          <div className="flex justify-between border-b border-slate-200 dark:border-white/10 pb-2">
             <span className="text-gray-500 dark:text-gray-400">GST Amount</span>
             <span className="text-neonPurple font-semibold">+{result.gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-slate-800 dark:text-white font-bold">Total Payable</span>
             <span className="text-2xl font-bold text-neonBlue">{result.total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

// --- QR Generator ---
export const QRGenerator: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');

  const generate = () => {
    if (!text) return;
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`);
  };

  return (
    <GlassCard title="QR Code Generator" className="h-full flex flex-col">
       <div className="space-y-4 flex-grow">
        <InputGroup label="Content (URL or Text)" id="qr-text" value={text} onChange={(e) => setText(e.target.value)} placeholder="https://example.com" />
        <NeonButton onClick={generate} className="w-full">Generate QR</NeonButton>
      </div>
      <div className="mt-6 flex justify-center items-center h-[200px] bg-slate-100 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 relative overflow-hidden group">
        {qrUrl ? (
          <img src={qrUrl} alt="QR Code" className="rounded-lg shadow-lg mix-blend-multiply dark:mix-blend-screen" />
        ) : (
          <p className="text-gray-500 text-sm">QR Code will appear here</p>
        )}
      </div>
    </GlassCard>
  );
};

// --- Password Generator ---
export const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState<number>(12);
  const [options, setOptions] = useState({ uppercase: true, lowercase: true, numbers: true, symbols: true });
  const [password, setPassword] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charset = "";
    if (options.uppercase) charset += upper;
    if (options.lowercase) charset += lower;
    if (options.numbers) charset += nums;
    if (options.symbols) charset += syms;

    if (charset === "") return;

    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPassword(retVal);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if(!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard title="Strong Password" className="h-full">
      <div className="space-y-4">
        <div>
           <div className="flex justify-between mb-2">
             <span className="text-sm text-slate-600 dark:text-gray-300">Length</span>
             <span className="text-sm font-bold text-neonBlue">{length}</span>
           </div>
           <input
             type="range" min="6" max="32" value={length}
             onChange={(e) => setLength(parseInt(e.target.value))}
             className="w-full h-2 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-neonBlue"
           />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600 dark:text-gray-300">
           {Object.keys(options).map(key => (
             <label key={key} className="flex items-center space-x-2 cursor-pointer hover:text-slate-900 dark:hover:text-white">
               <input
                 type="checkbox"
                 checked={options[key as keyof typeof options]}
                 onChange={() => setOptions({...options, [key]: !options[key as keyof typeof options]})}
                 className="form-checkbox rounded text-neonPurple focus:ring-0 bg-slate-200 dark:bg-slate-700 border-none"
               />
               <span className="capitalize">{key}</span>
             </label>
           ))}
        </div>
        <NeonButton onClick={generate} variant="secondary" className="w-full group">
          <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          <span>Generate</span>
        </NeonButton>
      </div>
      <div className="mt-4 relative">
        <div className="w-full bg-white dark:bg-black/30 border border-slate-300 dark:border-white/10 rounded-xl p-4 font-mono text-center text-lg min-h-[60px] flex items-center justify-center break-all text-neonGreen shadow-inner">
           {password || "...."}
        </div>
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg transition-colors text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
          title="Copy"
        >
          {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18} />}
        </button>
      </div>
    </GlassCard>
  );
};