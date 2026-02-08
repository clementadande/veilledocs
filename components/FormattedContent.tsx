
import React from 'react';

interface FormattedContentProps {
  content: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  
  const parseInlineStyles = (text: string) => {
    // 1. Handle Markdown Links: [label](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Add the link component
      parts.push(
        <a 
          key={match.index}
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[11px] font-bold border border-indigo-100 hover:bg-indigo-600 hover:text-white transition-all mx-0.5 no-underline"
        >
          <span className="max-w-[120px] truncate">{match[1]}</span>
          <span className="text-[10px]">↗</span>
        </a>
      );
      
      lastIndex = linkRegex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // 2. Wrap text nodes to handle bold within them
    return parts.map((part, i) => {
      if (typeof part === 'string') {
        if (part.includes('**')) {
          const boldParts = part.split('**');
          return boldParts.map((bp, j) => j % 2 === 1 ? <strong key={`${i}-${j}`} className="font-bold text-slate-900">{bp}</strong> : bp);
        }
        return part;
      }
      return part;
    });
  };

  const formatLines = (text: string) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed === '') return <div key={i} className="h-4" />;
      
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-5 border-b border-slate-100 pb-2">{parseInlineStyles(line.replace('## ', ''))}</h2>;
      }
      
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xl font-bold text-slate-800 mt-8 mb-4">{parseInlineStyles(line.replace('### ', ''))}</h3>;
      }
      
      if (line.startsWith('- ') || line.startsWith('* ')) {
        return (
          <li key={i} className="ml-4 list-none flex items-start gap-3 text-slate-700 mb-3">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 shrink-0"></span>
            <div className="flex-1">{parseInlineStyles(line.substring(2))}</div>
          </li>
        );
      }

      // Default paragraph
      return <p key={i} className="text-slate-700 leading-relaxed mb-5 text-[15px]">{parseInlineStyles(line)}</p>;
    });
  };

  return (
    <div className="prose prose-indigo max-w-none">
      {formatLines(content)}
    </div>
  );
};

export default FormattedContent;
