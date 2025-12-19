// src/components/dashboard/RecentScans.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scan } from 'lucide-react';

// Mock types si no existen los de scanner
interface ScannedItem {
    id: string;
    name: string;
    calories: number;
    timestamp: string;
}

interface RecentScansProps {
    scans?: ScannedItem[];
}

export const RecentScans: React.FC<RecentScansProps> = ({ scans = [] }) => {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Scan className="text-purple-600" size={20} />
            Escaneos Recientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {scans.length > 0 ? (
            <div className="space-y-3">
                {scans.slice(0, 3).map((scan) => (
                    <div key={scan.id} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                        <div>
                            <p className="font-medium text-sm text-gray-900">{scan.name}</p>
                            <p className="text-xs text-gray-500">{new Date(scan.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{scan.calories} kcal</span>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-6 text-gray-400 text-sm">
                No has escaneado alimentos hoy.
            </div>
        )}
      </CardContent>
    </Card>
  );
};