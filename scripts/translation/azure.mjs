import { parseFragment } from 'parse5';
import { escapeHtml } from '../site-lib.mjs';
import { validateMarkers } from './markdown.mjs';

export function azureEnabled(env = process.env) {
  return env.TRANSLATION_ENABLED === 'true' && env.AZURE_TRANSLATOR_SKU === 'F0' && env.TRANSLATION_F0_CONFIRMED === 'true' && !!env.AZURE_TRANSLATOR_KEY && !!env.AZURE_TRANSLATOR_REGION;
}

export function wireText(text) {
  return '<div>' + escapeHtml(text).replace(/\[\[NT\d+\]\]/g, token => `<span class="notranslate" translate="no">${token}</span>`) + '</div>';
}

function translatedText(html) {
  function text(node) { return node.nodeName === '#text' ? node.value : (node.childNodes || []).map(text).join(''); }
  return text(parseFragment(html));
}

export function createAzureTranslator({ env = process.env, state, fetchImpl = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), minInterval = 16000 } = {}) {
  if (!azureEnabled(env)) throw new Error('Azure translation is disabled or F0 confirmation / credentials are missing');
  const endpoint = new URL(env.AZURE_TRANSLATOR_ENDPOINT || 'https://api.cognitive.microsofttranslator.com');
  if (endpoint.protocol !== 'https:' || endpoint.username || endpoint.password || endpoint.search || endpoint.hash || !['/', ''].includes(endpoint.pathname) || !(endpoint.hostname === 'api.cognitive.microsofttranslator.com' || /^[a-z\d-]+\.cognitiveservices\.azure\.com$/.test(endpoint.hostname))) throw new Error('Unsupported Translator endpoint');
  const url = new URL(endpoint.hostname === 'api.cognitive.microsofttranslator.com' ? '/translate' : '/translator/text/v3.0/translate', endpoint);
  url.searchParams.set('api-version', '3.0');
  url.searchParams.set('from', 'zh-Hans');
  url.searchParams.set('textType', 'html');
  let sent = false;
  return {
    async translate(texts, language) {
      if (!['en', 'ja'].includes(language)) throw new Error('Unsupported translation language');
      if (texts.length > 100 || !texts.length) throw new Error('Invalid translation batch');
      const body = texts.map(text => ({ Text: wireText(text) }));
      const estimate = body.reduce((sum, item) => sum + item.Text.length, 0);
      if (estimate > 10000) throw new Error('Translation request exceeds the conservative batch limit');
      const request = new URL(url);
      request.searchParams.append('to', language);
      let last = 'translation_failed';
      for (let attempt = 0; attempt < 3; attempt++) {
        if (sent) await sleep(Math.max(minInterval, attempt ? 15000 * attempt : 0));
        await state.reserve(estimate);
        sent = true;
        let response;
        try {
          response = await fetchImpl(request, { method: 'POST', redirect: 'error', headers: { 'Ocp-Apim-Subscription-Key': env.AZURE_TRANSLATOR_KEY, 'Ocp-Apim-Subscription-Region': env.AZURE_TRANSLATOR_REGION, 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(30000) });
        } catch { last = 'network_or_timeout'; continue; }
        let data;
        try { data = await response.json(); } catch { last = 'invalid_api_response'; continue; }
        const code = Number(data?.error?.code);
        if (code === 403001) { await state.pauseForQuota(); throw new Error('cycle_quota_exhausted'); }
        if (!response.ok) {
          if (response.status === 429) { last = 'rate_limited'; continue; }
          if (response.status >= 500) { last = 'service_error'; continue; }
          throw new Error(response.status === 401 || response.status === 403 ? 'authorization_failed' : 'invalid_api_request');
        }
        try {
          if (!Array.isArray(data) || data.length !== texts.length) throw new Error();
          const translated = data.map(item => {
            const result = item.translations?.find(translation => translation.to === language)?.text;
            if (typeof result !== 'string' || !result.trim()) throw new Error();
            return translatedText(result);
          });
          texts.forEach((text, index) => validateMarkers(text, translated[index]));
          return translated;
        } catch { last = 'placeholder_or_response_integrity'; }
      }
      throw new Error(last);
    },
  };
}
