'use client';

import { useEffect, useState } from 'react';
import { isCutToday } from '@/lib/format';

export function HeroCutStatus() {
  const [text, setText] = useState('Verificando disponibilidad…');
  useEffect(() => {
    const refresh = () => setText(isCutToday() ? 'Entrega hoy disponible' : 'Reserva tu próxima entrega');
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, []);
  return <span>{text}</span>;
}
