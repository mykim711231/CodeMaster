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
import { initStats } from './ui/stats';
import { registerLanguage } from './syntax/registry';
import { javaAdapter } from './syntax/lang/java';
import { pythonAdapter } from './syntax/lang/python';
import { initTrainer } from './trainer';

// 구문 강조 언어 어댑터 등록
registerLanguage('java', javaAdapter);
registerLanguage('python', pythonAdapter);

// UI
initIcons();
initTheme();
initPanels();
initMenu();
initAccordion();
initStats();

// 타이핑 트레이너 (학습팩 → 엔진, "다음 문제"·팩 전환, 완료 시 세션 기록)
initTrainer();

// 참고: Service Worker 는 현재 비활성(킬 스위치, public/sw.js).
// SW 캐시 staleness 로 인한 멈춤 해소. 오프라인 PWA 는 추후 vite-plugin-pwa 로 정식 재도입.
