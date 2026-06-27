// 폰트 self-host (@fontsource — 외부 CDN 제거)
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/jetbrains-mono/300.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/600.css';
import '@fontsource/jetbrains-mono/700.css';

import './styles.css';

import { initIcons } from './icons';
import { initTheme } from './ui/theme';
import { initPanels } from './ui/panels';
import { initMenu } from './ui/menu';
import { initAccordion } from './ui/accordion';
import { registerLanguage } from './syntax/registry';
import { javaAdapter } from './syntax/lang/java';
import { pythonAdapter } from './syntax/lang/python';
import { initTypingEngine } from './engine/typing';
import { registerServiceWorker } from './pwa';
import { saveSession } from './storage/db';
import { appStore } from './store';

// 구문 강조 언어 어댑터 등록
registerLanguage('java', javaAdapter);
registerLanguage('python', pythonAdapter);

// UI
initIcons();
initTheme();
initPanels();
initMenu();
initAccordion();

// 타이핑 트레이너 (현재는 Java JPA 예시 — 이후 학습팩에서 target 주입)
initTypingEngine({
  lang: 'java',
  onComplete: (result) => {
    // 학습 세션을 IndexedDB에 기록 (소스 원문 아님 — 지표만)
    void saveSession({ ts: Date.now(), ...result });
    appStore.getState().recordCompletion(result.wpm);
  },
});

// PWA
registerServiceWorker();
