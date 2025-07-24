import type { Supplier } from '@/types/types';
import { useEffect, useState } from 'react';

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierDebt, setNewSupplierDebt] = useState('0');

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const res = await fetch('/api/admin/suppliers');

      if (!res.ok) {
        throw new Error('Failed to load suppliers');
      }

      const data = await res.json();
      const suppliers: Supplier[] = data.map((s: Supplier) => ({
        ...s,
        totalDebt: Number(s.totalDebt),
      }));

      setSuppliers(suppliers);
    } catch (error) {
      console.log(error);
    }
  }

  async function addSupplier() {
    try {
      const res = await fetch('/api/admin/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSupplierName,
          totalDebt: parseFloat(newSupplierDebt) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add supplier');
      }

      setNewSupplierName('');
      setNewSupplierDebt('0');
      await fetchSuppliers();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Постачальники</h1>

      <ul>
        {suppliers.map(({ id, name, totalDebt }) => (
          <li key={id}>
            <strong>{name}</strong> — Борг: {totalDebt.toFixed(2)} грн
          </li>
        ))}
      </ul>

      <h2>Додати нового постачальника</h2>
      <input
        type='text'
        placeholder='Назва постачальника'
        value={newSupplierName}
        onChange={(e) => setNewSupplierName(e.target.value)}
      />
      <input
        type='number'
        placeholder='Заборгованість'
        value={newSupplierDebt}
        onChange={(e) => setNewSupplierDebt(e.target.value)}
        step='0.01'
        min='0'
      />
      <button onClick={addSupplier}>Додати</button>
    </div>
  );
}
