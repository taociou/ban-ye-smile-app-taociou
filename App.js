import React, { useState } from 'react';
import './TaiocouStyle.css';

const emotions = [
  { emoji: '😊', label: '開心' },
  { emoji: '😡', label: '生氣' },
  { emoji: '😢', label: '難過' },
  { emoji: '😰', label: '焦慮' },
  { emoji: '😐', label: '無感' }
];

const purposes = ['IG貼文', '課程標題', '行銷廣告', '產品介紹', '品牌句子'];
const modes = ['emotion', 'copywriting', 'story', 'quote'];

function App() {
  const [mode, setMode] = useState('emotion');
  const [emotion, setEmotion] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState('');
  const [copyPurpose, setCopyPurpose] = useState(purposes[0]);
  const [copyTopic, setCopyTopic] = useState('');
  const [copyResult, setCopyResult] = useState('');
  const [storyInput, setStoryInput] = useState('');
  const [storyResult, setStoryResult] = useState('');
  const [quoteResult, setQuoteResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchGPT = async (prompt, setter) => {
    try {
      setLoading(true);
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer sk-proj-4W2bah49ZmRDMlRwpqKH4-a947N8GK_8w_xZd-zeHGbHJG2rS7zBIzw8OLeG13iFzVpDclRgwcT3BlbkFJu8pY8NF5dem54SWktssjl2VU-qtfELJpuemPPy3TpzH3-6IIfn0ytrP1D1kH},
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8
        })
      });

      const data = await res.json();

      if (data.error) {
        const errorMsg = data.error.message;
        let zhMessage = '❗️ 發生錯誤，請稍後再試';

        if (errorMsg.includes('quota')) {
          zhMessage = '❗️ 您的 GPT 使用配額已用完，請登入 OpenAI 帳號檢查付款與配額狀態。';
        } else if (errorMsg.includes('Unauthorized')) {
          zhMessage = '❗️ 金鑰驗證失敗，請檢查 API Key 是否正確或已啟用。';
        } else if (errorMsg.includes('maximum context length')) {
          zhMessage = '❗️ 輸入內容過長，請嘗試刪減後再送出。';
        }

        setter(zhMessage);
      } else {
        setter(data.choices[0].message.content);
      }
    } catch (err) {
      setter('❗️ 系統異常或網路錯誤，請稍後再試。');
    } finally {
      setLoading(false);
    }
  };

  const handleEmotionSubmit = () => {
    if (!userInput || !emotion) return;
    const prompt = `你是一個非常理解人心的 AI 朋友，用溫柔的語氣回應使用者。使用者現在的情緒是「${emotion.label}」，並說了：「${userInput}」。請你以關懷、療癒的方式，給予傾聽與溫暖的引導，最後加上一句溫柔的祝福或建議。`;
    fetchGPT(prompt, setResponse);
  };

  const handleCopySubmit = () => {
    if (!copyTopic) return;
    const prompt = `你是一個專業的文案創作者，使用者提供一個主題與文案用途，請幫我分別以三種不同風格生成文案：
1. 溫暖療癒
2. 專業有力
3. 調皮有趣
主題是：「${copyTopic}」
用途是：「${copyPurpose}」
請生成三段不一樣的文案，每段以「風格名稱」開頭。`;
    fetchGPT(prompt, setCopyResult);
  };

  const handleStorySubmit = () => {
    if (!storyInput) return;
    const prompt = `你是一位擅長寫故事的創意 AI，請根據以下提示創作一段感人的小故事，約 300 字。
提示：「${storyInput}」`;
    fetchGPT(prompt, setStoryResult);
  };

  const handleQuoteSubmit = () => {
    const prompt = `請生成一句適合今天分享的 AI 金句，可以是勵志、療癒、人生觀點或哲理，文字不超過 50 字，溫柔中帶啟發。`;
    fetchGPT(prompt, setQuoteResult);
  };

  return (
    <div className='taiocou-container'>
      <div className='mode-switcher'>
        {modes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={mode === m ? 'active' : ''}
          >
            {m === 'emotion'
              ? 'AI 心理對話'
              : m === 'copywriting'
              ? '文案標題生成'
              : m === 'story'
              ? '故事創作'
              : '每日語錄'}
          </button>
        ))}
      </div>

      {mode === 'emotion' && (
        <>
          <h2 className='taiocou-heading'>您好啊，昨天半夜偷笑了嗎？</h2>
          <div className='emotion-buttons'>
            {emotions.map((emo) => (
              <button
                key={emo.label}
                className={`emotion-btn ${emotion?.label === emo.label ? 'selected' : ''}`}
                onClick={() => setEmotion(emo)}
              >
                {emo.emoji} {emo.label}
              </button>
            ))}
          </div>
          <textarea
            className='taiocou-textarea'
            placeholder='想說些什麼呢？...'
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            className='submit-button'
            onClick={handleEmotionSubmit}
            disabled={loading}
          >
            {loading ? '思考中...' : '說給我聽 ❤️'}
          </button>
          {response && <div className='response-box'>{response}</div>}
        </>
      )}

      {mode === 'copywriting' && (
        <>
          <h2 className='taiocou-heading'>想產出讓人忍不住偷笑的文案嗎？</h2>
          <div className='form-group'>
            <label>文案用途：</label>
            <select
              value={copyPurpose}
              onChange={(e) => setCopyPurpose(e.target.value)}
            >
              {purposes.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className='form-group'>
            <label>主題關鍵字：</label>
            <input
              className='taiocou-textinput'
              placeholder='例如：芳香療法'
              value={copyTopic}
              onChange={(e) => setCopyTopic(e.target.value)}
            />
          </div>
          <button
            className='submit-button'
            onClick={handleCopySubmit}
            disabled={loading}
          >
            {loading ? '生成中...' : '幫我寫！✍️'}
          </button>
          {copyResult && <div className='response-box'>{copyResult}</div>}
        </>
      )}

      {mode === 'story' && (
        <>
          <h2 className='taiocou-heading'>輸入提示，我來寫故事 📖</h2>
          <textarea
            className='taiocou-textarea'
            placeholder='例如：迷路的小狐狸'
            value={storyInput}
            onChange={(e) => setStoryInput(e.target.value)}
          />
          <button
            className='submit-button'
            onClick={handleStorySubmit}
            disabled={loading}
          >
            {loading ? '創作中...' : '開始說故事 🎤'}
          </button>
          {storyResult && <div className='response-box'>{storyResult}</div>}
        </>
      )}

      {mode === 'quote' && (
        <>
          <h2 className='taiocou-heading'>點一下，送你一句金句 ✨</h2>
          <button
            className='submit-button'
            onClick={handleQuoteSubmit}
            disabled={loading}
          >
            {loading ? '生成中...' : '給我一句話 🌿'}
          </button>
          {quoteResult && <div className='response-box'>{quoteResult}</div>}
        </>
      )}
