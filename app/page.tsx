'use client';

import { useCallback, useEffect, useState } from 'react';
import { Delete, Divide, Equal, Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Operator = '+' | '-' | '*' | '/';
const symbols: Record<Operator, string> = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function calculate(left: number, right: number, operator: Operator) {
  if (operator === '/' && right === 0) return null;
  const result = operator === '+' ? left + right : operator === '-' ? left - right : operator === '*' ? left * right : left / right;
  return Number.isFinite(result) ? Number.parseFloat(result.toPrecision(12)) : null;
}

function formatNumber(value: string) {
  if (value === 'Error') return value;
  const number = Number(value);
  if (!Number.isFinite(number)) return 'Error';
  const [whole, decimal] = value.split('.');
  const formatted = Number(whole).toLocaleString('en-US');
  return decimal === undefined ? formatted : `${formatted}.${decimal}`;
}

export default function Home() {
  const [display, setDisplay] = useState('0');
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [expression, setExpression] = useState('Ready');

  const clear = useCallback(() => {
    setDisplay('0'); setStored(null); setOperator(null); setWaiting(false); setExpression('Ready');
  }, []);

  const inputDigit = useCallback((digit: string) => {
    if (display === 'Error' || waiting) { setDisplay(digit); setWaiting(false); return; }
    if (display.replace('-', '').replace('.', '').length >= 12) return;
    setDisplay(display === '0' ? digit : display + digit);
  }, [display, waiting]);

  const inputDecimal = useCallback(() => {
    if (display === 'Error' || waiting) { setDisplay('0.'); setWaiting(false); }
    else if (!display.includes('.')) setDisplay(display + '.');
  }, [display, waiting]);

  const chooseOperator = useCallback((next: Operator) => {
    if (display === 'Error') return;
    const current = Number(display);
    if (operator && stored !== null && !waiting) {
      const result = calculate(stored, current, operator);
      if (result === null) {
        setDisplay('Error'); setExpression('Cannot divide by zero'); setStored(null); setOperator(null); return;
      }
      setDisplay(String(result)); setStored(result); setExpression(`${result} ${symbols[next]}`);
    } else {
      setStored(current); setExpression(`${formatNumber(display)} ${symbols[next]}`);
    }
    setOperator(next); setWaiting(true);
  }, [display, operator, stored, waiting]);

  const equals = useCallback(() => {
    if (!operator || stored === null || display === 'Error') return;
    const result = calculate(stored, Number(display), operator);
    if (result === null) { setDisplay('Error'); setExpression('Cannot divide by zero'); }
    else { setExpression(`${stored.toLocaleString()} ${symbols[operator]} ${formatNumber(display)} =`); setDisplay(String(result)); }
    setStored(null); setOperator(null); setWaiting(true);
  }, [display, operator, stored]);

  const toggleSign = useCallback(() => {
    if (display !== '0' && display !== 'Error') setDisplay(String(Number(display) * -1));
  }, [display]);

  const percentage = useCallback(() => {
    if (display === 'Error') return;
    setDisplay(String(Number(display) / 100)); setWaiting(false);
  }, [display]);

  const backspace = useCallback(() => {
    if (display === 'Error') return clear();
    if (waiting) return;
    setDisplay(display.length <= 1 || (display.length === 2 && display.startsWith('-')) ? '0' : display.slice(0, -1));
  }, [clear, display, waiting]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (/^[0-9]$/.test(event.key)) inputDigit(event.key);
      else if (event.key === '.') inputDecimal();
      else if (['+', '-', '*', '/'].includes(event.key)) chooseOperator(event.key as Operator);
      else if (event.key === 'Enter' || event.key === '=') equals();
      else if (event.key === 'Escape' || event.key.toLowerCase() === 'c') clear();
      else if (event.key === 'Backspace' || event.key === 'Delete') backspace();
      else if (event.key === '%') percentage();
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [backspace, chooseOperator, clear, equals, inputDecimal, inputDigit, percentage]);

  const keyClass = 'h-[68px] rounded-[18px] border-0 text-[21px] font-semibold shadow-[0_7px_14px_rgba(91,40,64,.07)] transition duration-150 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.97] sm:h-[74px]';
  const numberClass = `${keyClass} bg-white text-[#49343d] hover:bg-[#fff8fb]`;
  const utilityClass = `${keyClass} bg-[#f9dce7] text-[#9f4367] hover:bg-[#f6cfde]`;
  const operationClass = `${keyClass} bg-[#eda9c2] text-white hover:bg-[#e99bb8]`;

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fff5f8] px-4 py-8 text-[#3f2c34]">
      <div aria-hidden="true" className="absolute -left-24 -top-28 h-80 w-80 rounded-full bg-[#f8cada]/40 blur-3xl" />
      <div aria-hidden="true" className="absolute -bottom-28 -right-20 h-96 w-96 rounded-full bg-[#efb4c9]/35 blur-3xl" />
      <section aria-label="Calculator" className="relative w-full max-w-[410px] rounded-[34px] border border-white/80 bg-[#fffafb]/90 p-5 shadow-[0_28px_70px_rgba(122,62,86,.16)] backdrop-blur-xl sm:p-6">
        <header className="mb-5 flex items-center justify-between px-1">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#c47794]">Everyday</p><h1 className="mt-0.5 text-xl font-bold tracking-[-0.03em]">Calculator</h1></div>
          <div className="flex gap-1.5" aria-hidden="true"><span className="size-2 rounded-full bg-[#f0b7cb]" /><span className="size-2 rounded-full bg-[#de789f]" /></div>
        </header>
        <div className="mb-4 min-h-[136px] rounded-[25px] border border-[#f8e2ea] bg-white px-5 py-5 text-right shadow-[inset_0_1px_0_white,0_8px_24px_rgba(118,59,82,.06)]">
          <p className={`mb-2 h-5 truncate text-sm font-medium ${display === 'Error' ? 'text-[#c65270]' : 'text-[#bd8298]'}`}>{expression}</p>
          <output aria-live="polite" aria-atomic="true" className={`block truncate font-mono text-[clamp(2.15rem,11vw,3.15rem)] font-semibold leading-tight tracking-[-0.055em] ${display === 'Error' ? 'text-[#c65270]' : 'text-[#3f2c34]'}`}>{formatNumber(display)}</output>
        </div>
        <div className="grid grid-cols-4 gap-3" role="group" aria-label="Calculator keypad">
          <Button className={utilityClass} onClick={clear} aria-label="All clear">AC</Button>
          <Button className={utilityClass} onClick={toggleSign} aria-label="Toggle positive or negative">±</Button>
          <Button className={utilityClass} onClick={percentage} aria-label="Percentage">%</Button>
          <Button className={operationClass} onClick={() => chooseOperator('/')} aria-label="Divide"><Divide strokeWidth={2.5} /></Button>
          {['7','8','9'].map((n) => <Button key={n} className={numberClass} onClick={() => inputDigit(n)}>{n}</Button>)}
          <Button className={operationClass} onClick={() => chooseOperator('*')} aria-label="Multiply"><X strokeWidth={2.5} /></Button>
          {['4','5','6'].map((n) => <Button key={n} className={numberClass} onClick={() => inputDigit(n)}>{n}</Button>)}
          <Button className={operationClass} onClick={() => chooseOperator('-')} aria-label="Subtract"><Minus strokeWidth={2.5} /></Button>
          {['1','2','3'].map((n) => <Button key={n} className={numberClass} onClick={() => inputDigit(n)}>{n}</Button>)}
          <Button className={operationClass} onClick={() => chooseOperator('+')} aria-label="Add"><Plus strokeWidth={2.5} /></Button>
          <Button className={numberClass} onClick={backspace} aria-label="Backspace"><Delete strokeWidth={2.2} /></Button>
          <Button className={numberClass} onClick={() => inputDigit('0')}>0</Button>
          <Button className={numberClass} onClick={inputDecimal} aria-label="Decimal point">.</Button>
          <Button className={`${keyClass} bg-[#c95783] text-white shadow-[0_9px_20px_rgba(194,76,119,.24)] hover:bg-[#b94671]`} onClick={equals} aria-label="Equals"><Equal strokeWidth={2.7} /></Button>
        </div>
        <p className="mt-5 text-center text-[11px] font-medium tracking-wide text-[#be8ba0]">Keyboard friendly <span aria-hidden="true">·</span> Esc to clear <span aria-hidden="true">·</span> Enter to solve</p>
      </section>
    </main>
  );
}
