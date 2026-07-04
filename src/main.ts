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
import { initSettings } from './ui/settings';
import { initResize } from './ui/resize';
import { registerLanguage } from './syntax/registry';
import { javaAdapter } from './syntax/lang/java';
import { pythonAdapter } from './syntax/lang/python';
import { xmlAdapter } from './syntax/lang/xml';
import { sqlAdapter } from './syntax/lang/sql';
import { yamlAdapter } from './syntax/lang/yaml';
import { propertiesAdapter } from './syntax/lang/properties';
import { jsonAdapter } from './syntax/lang/json';
import { kotlinAdapter } from './syntax/lang/kotlin';
import { jsAdapter } from './syntax/lang/js';
import { goAdapter } from './syntax/lang/go';
import { dockerfileAdapter } from './syntax/lang/dockerfile';
import { shellAdapter } from './syntax/lang/shell';
import { markdownAdapter } from './syntax/lang/markdown';
import { cssAdapter } from './syntax/lang/css';
import { htmlAdapter } from './syntax/lang/html';
import { rustAdapter } from './syntax/lang/rust';
import { cAdapter } from './syntax/lang/c';
import { rubyAdapter } from './syntax/lang/ruby';
import { initTrainer } from './trainer';
import { updateTopbar } from './storage/db';

// 구문 강조 언어 어댑터 등록
registerLanguage('java', javaAdapter);
registerLanguage('python', pythonAdapter);
registerLanguage('xml', xmlAdapter);
registerLanguage('sql', sqlAdapter);
registerLanguage('yaml', yamlAdapter);
registerLanguage('yml', yamlAdapter);
registerLanguage('properties', propertiesAdapter);
registerLanguage('gradle', propertiesAdapter);
registerLanguage('json', jsonAdapter);
registerLanguage('kotlin', kotlinAdapter);
registerLanguage('js', jsAdapter);
registerLanguage('ts', jsAdapter);
registerLanguage('go', goAdapter);
registerLanguage('dockerfile', dockerfileAdapter);
registerLanguage('sh', shellAdapter);
registerLanguage('markdown', markdownAdapter);
registerLanguage('md', markdownAdapter);
registerLanguage('css', cssAdapter);
registerLanguage('html', htmlAdapter);
registerLanguage('htm', htmlAdapter);
registerLanguage('rust', rustAdapter);
registerLanguage('rs', rustAdapter);
registerLanguage('c', cAdapter);
registerLanguage('cpp', cAdapter);
registerLanguage('h', cAdapter);
registerLanguage('ruby', rubyAdapter);
registerLanguage('rb', rubyAdapter);

// UI
initIcons();
initTheme();
initPanels();
initMenu();
initAccordion();
initStats();
initSettings();
initResize();

// 타이핑 트레이너 (학습팩 -> 엔진, "다음 문제"·팩 전환, 완료 시 세션 기록)
initTrainer();

updateTopbar();

// 참고: Service Worker 는 현재 비활성(킬 스위치, public/sw.js).
// SW 캐시 staleness 로 인한 멈춤 해소. 오프라인 PWA 는 추후 vite-plugin-pwa 로 정식 재도입.
