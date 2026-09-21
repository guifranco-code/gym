import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { ProgressDataPoint } from '../../types';
import { TrendingUp, Award, Dumbbell, Calendar, Activity } from 'lucide-react';

interface EvolutionChartProps {
  data: ProgressDataPoint[];
  exerciseName: string;
}

export const EvolutionChart: React.FC<EvolutionChartProps> = ({ data, exerciseName }) => {
  const [metric, setMetric] = useState<'weight' | 'volume'>('weight');

  if (!data || data.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Dumbbell className="w-10 h-10 mx-auto text-slate-600 mb-3" />
        <h4 className="text-base font-semibold text-slate-200">Sem registros ainda</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Assim que o aluno registrar as cargas e repetições deste exercício nas sessões de treino, a curva de evolução de força aparecerá aqui.
        </p>
      </div>
    );
  }

  const initialWeight = data[0]?.maxWeightKg || 0;
  const latestWeight = data[data.length - 1]?.maxWeightKg || 0;
  const maxWeightEver = Math.max(...data.map(d => d.maxWeightKg));
  const diff = latestWeight - initialWeight;
  const percentGain = initialWeight > 0 ? ((diff / initialWeight) * 100).toFixed(1) : '0';

  const chartData = data.map(item => ({
    date: item.formattedDate,
    weight: item.maxWeightKg,
    volume: item.totalVolumeKg,
    reps: item.bestReps,
    workoutName: item.workoutName
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm text-slate-100 space-y-5">
      
      {/* Header & Stats Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Evolução de Força
          </span>
          <h3 className="text-lg font-bold text-white mt-0.5">{exerciseName}</h3>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <button
            onClick={() => setMetric('weight')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              metric === 'weight'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Carga Máxima (kg)
          </button>
          <button
            onClick={() => setMetric('volume')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              metric === 'volume'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Volume Total (kg)
          </button>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Recorde (PR)</span>
          </div>
          <div className="text-xl font-bold text-white">
            {maxWeightEver} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
            <span>Última Carga</span>
          </div>
          <div className="text-xl font-bold text-white">
            {latestWeight} <span className="text-xs font-normal text-slate-400">kg</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
            <span>Progressão</span>
          </div>
          <div className={`text-xl font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {diff >= 0 ? `+${diff}` : diff} <span className="text-xs font-normal text-slate-400">kg ({percentGain}%)</span>
          </div>
        </div>

        <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
            <span>Sessões</span>
          </div>
          <div className="text-xl font-bold text-white">
            {data.length} <span className="text-xs font-normal text-slate-400">treinos</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {metric === 'weight' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-white">{label} • {d.workoutName}</p>
                        <p className="text-emerald-400 font-bold text-sm">
                          Carga Máxima: {d.weight} kg
                        </p>
                        <p className="text-slate-400">Repetições no pico: {d.reps} reps</p>
                        <p className="text-slate-400">Volume total: {d.volume} kg</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                name="Carga (kg)"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 5, fill: '#10b981', stroke: '#064e3b', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#34d399' }}
              />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const d = payload[0].payload;
                    return (
                      <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-xl text-xs space-y-1">
                        <p className="font-semibold text-white">{label} • {d.workoutName}</p>
                        <p className="text-blue-400 font-bold text-sm">
                          Volume Total: {d.volume} kg
                        </p>
                        <p className="text-slate-400">Carga máxima: {d.weight} kg</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                name="Volume Total (kg)"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

    </div>
  );
};
