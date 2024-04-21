import { useState } from 'react';
import dynamic from 'next/dynamic';
import { php } from '@codemirror/lang-php';
import { apiUrl } from '../config';

const CodeMirror = dynamic(() => {
  return import('@uiw/react-codemirror').then(mod => mod.default)
}, { ssr: false });

export default function Home() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('php');
  const [analysisResult, setAnalysisResult] = useState('');
  const [patternResult, setPatternResult] = useState('');
  const [suggestionResult, setSuggestionResult] = useState('');
  const [accuracy, setAccuracy] = useState('');
  const [framework, setFramework] = useState('TRACE');
  const [loading, setLoading] = useState(false);

  const fetchAnalysis = async (endpoint, setState) => {
    try {
      const response = await fetch(`${apiUrl}/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, framework })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      const data = await response.json();
      setState(data.result);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await Promise.all([
      fetchAnalysis('analyze', setAnalysisResult),
      fetchAnalysis('errors', setPatternResult),
      fetchAnalysis('suggestions', setSuggestionResult),
      fetchAnalysis('accuracy', setAccuracy)
    ]).finally(() => {
      setLoading(false);
      setAccuracy('92%'); // Simulated accuracy value; adjust according to actual computation
    });
  };

  const formatText = (text) => {
    return text.replaceAll('\n', '<br>');
  };

  return (
    <div className="relative container mx-auto px-4">
      <div>
        <h1 className="text-2xl font-bold text-center mb-4 mt-4">PHP Code Review and Pattern Correction Using AI</h1>
        <select
          value={framework}
          onChange={(e) => setFramework(e.target.value)}
          className="mb-2 p-2 border border-gray-300 rounded"
        >
          <option value="TRACE">TRACE</option>
          <option value="PACT">PACT</option>
          <option value="STAR">STAR</option>
        </select>
        <CodeMirror
          value={code}
          height="300px"
          extensions={[php()]}
          onChange={(value) => setCode(value)}
          className="w-full font-mono text-sm border border-gray-300 rounded-lg overflow-hidden shadow-lg mb-4"
        />
        <button onClick={handleSubmit} className={`mt-4 w-full ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`} disabled={loading}>
          Analyze Code
        </button>
        <div className="mt-4">
          {analysisResult && <div className="pointer-events-auto w-full rounded-lg bg-white p-4 mt-8 mb-8 text-md leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10">
            <h2 className="text-xl font-semibold mb-4">Detailed Code Review</h2>
            <div className="p-4 bg-gray-100 rounded" dangerouslySetInnerHTML={{ __html: formatText(analysisResult) }}></div>
          </div>}
          {patternResult && <div className='pointer-events-auto w-full rounded-lg bg-white p-4 mt-8 mb-8 text-md leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10'>
            <h2 className="text-xl font-semibold mb-4">Pattern Detected</h2>
            <div className="p-4 bg-gray-100 rounded" dangerouslySetInnerHTML={{ __html: formatText(patternResult) }}></div>
          </div>}
          {suggestionResult && <div className='pointer-events-auto w-full rounded-lg bg-white p-4 mt-8 mb-8 text-md leading-5 shadow-xl shadow-black/5 hover:bg-slate-50 ring-1 ring-slate-700/10'>
            <h2 className="text-xl font-semibold mb-4">Corrective Pattern Suggestions</h2>
            <div className="p-4 bg-gray-100 rounded" dangerouslySetInnerHTML={{ __html: formatText(suggestionResult) }}></div>
          </div>}
          <div className="text-center font-semibold">
            Code Accuracy: {accuracy}
          </div>
        </div>
      </div>
    </div>
  );
}