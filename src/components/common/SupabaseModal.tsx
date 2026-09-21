import React, { useState } from 'react';
import { Database, Copy, Check, ExternalLink, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { getSupabaseConfig, resetSupabaseClient, SUPABASE_SQL_SCHEMA } from '../../lib/supabase';
import { fetchAllData } from '../../lib/storage';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRefreshed?: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onDataRefreshed }) => {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const currentConfig = getSupabaseConfig();
  const [urlInput, setUrlInput] = useState(currentConfig.url);
  const [keyInput, setKeyInput] = useState(currentConfig.anonKey);

  if (!isOpen) return null;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCredentials = async () => {
    if (urlInput.trim()) {
      localStorage.setItem('supabase_custom_url', urlInput.trim());
    } else {
      localStorage.removeItem('supabase_custom_url');
    }

    if (keyInput.trim()) {
      localStorage.setItem('supabase_custom_key', keyInput.trim());
    } else {
      localStorage.removeItem('supabase_custom_key');
    }

    resetSupabaseClient();
    setTesting(true);
    setTestResult(null);

    try {
      await fetchAllData();
      setTestResult({
        success: true,
        message: 'Configuração salva! Conexão ativa e sincronizada com o Supabase.'
      });
      if (onDataRefreshed) onDataRefreshed();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: 'Aviso: Chaves salvas, certifique-se de executar o script SQL no Supabase para criar as tabelas.'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Banco de Dados Supabase</h3>
              <p className="text-xs text-slate-400">
                Status: {currentConfig.isConfigured ? (
                  <span className="text-emerald-400 font-medium">Conectado ao Supabase</span>
                ) : (
                  <span className="text-amber-400 font-medium">Modo Local Ativo (Pronto para Supabase)</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-sm">
          
          {/* Status Box */}
          <div className={`p-4 rounded-xl border ${currentConfig.isConfigured ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300' : 'bg-amber-950/20 border-amber-800/40 text-amber-300'}`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-sm">
                  {currentConfig.isConfigured
                    ? 'Seu aplicativo está conectado ao Supabase!'
                    : 'O app está funcionando perfeitamente com armazenamento persistente e dados de demonstração.'}
                </p>
                <p className="text-xs mt-1 opacity-90">
                  Para conectar ao seu banco de dados Supabase na nuvem, basta colar as credenciais abaixo e executar o script SQL no seu projeto.
                </p>
              </div>
            </div>
          </div>

          {/* Credentials Inputs */}
          <div className="space-y-4 bg-slate-800/40 p-4 rounded-xl border border-slate-800">
            <h4 className="font-medium text-slate-200 flex items-center gap-2">
              Credenciais do seu Projeto Supabase
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-normal ml-auto"
              >
                Abrir Supabase Dashboard <ExternalLink className="w-3 h-3" />
              </a>
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://exemplo.supabase.co"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Project API Key (Anon / Public)
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleSaveCredentials}
                disabled={testing}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                Salvar e Sincronizar
              </button>

              {testResult && (
                <span className={`text-xs ${testResult.success ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {testResult.message}
                </span>
              )}
            </div>
          </div>

          {/* SQL Script Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Script SQL para criar as tabelas no Supabase (SQL Editor)
              </label>
              <button
                onClick={handleCopySQL}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiado para Área de Transferência!' : 'Copiar Script SQL'}
              </button>
            </div>
            
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-56 leading-relaxed">
              {SUPABASE_SQL_SCHEMA}
            </pre>
            <p className="text-xs text-slate-500">
              No painel do Supabase, clique em <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, cole o código acima e clique em <strong>Run</strong>.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
