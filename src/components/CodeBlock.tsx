import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'yaml',
  filename,
  showLineNumbers = true
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.trim().split('\n');

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black shadow-lg">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0A0A0A] border-b border-white/10 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-mono text-zinc-300 font-medium">
            {filename || `${language.toUpperCase()} Configuration`}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/5 text-zinc-400 border border-white/5">
            {language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="font-mono text-[11px]">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto text-[13px] font-mono leading-relaxed">
        <pre className="text-zinc-200">
          <code>
            {lines.map((line, idx) => {
              const isComment = line.trim().startsWith('#') || line.trim().startsWith('//');
              const isKey = line.includes(':') && !isComment;
              
              return (
                <div key={idx} className="table-row">
                  {showLineNumbers && (
                    <span className="table-cell select-none pr-4 text-right text-zinc-600 text-[11px] w-8">
                      {idx + 1}
                    </span>
                  )}
                  <span className={`table-cell ${isComment ? 'text-zinc-500 italic' : isKey ? 'text-white font-medium' : 'text-zinc-300'}`}>
                    {line || ' '}
                  </span>
                </div>
              );
            })}
          </code>
        </pre>
      </div>
    </div>
  );
};
