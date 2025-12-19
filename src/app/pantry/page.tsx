// src/app/pantry/page.tsx
'use client';

import React, { useState } from 'react';
import AppShell from '@/components/shared/layout/AppShell';
import { usePantryStore } from '@/store/pantry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function PantryPage() {
  const { items, addItem, removeItem } = usePantryStore();
  const [newItemName, setNewItemName] = useState('');

  const handleAdd = () => {
    if (!newItemName.trim()) return;
    addItem({
        name: newItemName,
        quantity: 1,
        unit: 'unidad',
        category: 'Other'
    });
    setNewItemName('');
  };

  return (
    <AppShell title="Mi Despensa">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        
        {/* Add Item Section */}
        <Card className="p-4 flex gap-4 items-center bg-white">
            <Input 
                placeholder="Ej: Pechuga de pollo, Arroz..." 
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="flex-1"
            />
            <Button onClick={handleAdd}>Añadir Item</Button>
        </Card>

        {/* Pantry List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.length === 0 && (
                <p className="col-span-full text-center text-gray-500 py-10">Tu despensa está vacía. ¡Añade ingredientes para generar recetas!</p>
            )}
            {items.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg border flex justify-between items-center shadow-sm">
                    <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                        X
                    </Button>
                </div>
            ))}
        </div>

        {/* Actions */}
        {items.length > 0 && (
            <div className="flex justify-center pt-8">
                <Button size="lg" className="w-full md:w-auto" onClick={() => window.location.href='/recipes/from-pantry'}>
                    🪄 Generar Recetas con IA
                </Button>
            </div>
        )}
      </div>
    </AppShell>
  );
}