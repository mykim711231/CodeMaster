// Docs Navigator Module
// Handles the documentation navigation panel on the left side

let isInitialized = false;

export function initDocsNavigator() {
    if (isInitialized) return;
    isInitialized = true;

    // DOM elements
    const docsNavigator = document.getElementById('docsNavigator');
    const docsNavClose = document.getElementById('docsNavClose');
    const docsSearch = document.getElementById('docsSearch');
    const docsTree = document.getElementById('docsTree');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const overlay = document.getElementById('overlay');
    const sidebar = document.getElementById('sidebar');

    if (!docsNavigator || !docsNavClose || !docsSearch || !docsTree) return;

    // State
    let docsData = [];
    let filteredData = [];

    // Fetch documentation tree data
    async function loadDocsTree() {
        try {
            // Fetch the docs structure from the docs directory
            const response = await fetch('/docs-tree.json');
            if (!response.ok) throw new Error('Failed to load docs tree');
            docsData = await response.json();
            filteredData = [...docsData];
            renderDocsTree();
        } catch (error) {
            console.warn('Could not load docs tree from JSON, using fallback:', error);
            // Fallback: hardcoded structure based on the docs folders
            docsData = [
                {
                    type: 'folder',
                    label: 'Spring Boot 3.4.x',
                    path: 'docs/01.SpringBoot3.4.x',
                    children: [
                        { type: 'file', label: '01.Spring Boot 3.x 개요', path: 'docs/01.SpringBoot3.4.x/01.Spring Boot 3.x 개요.md' },
                        { type: 'file', label: '02.환경 설정 및 프로젝트 생성', path: 'docs/01.SpringBoot3.4.x/02.환경 설정 및 프로젝트 생성.md' },
                        { type: 'file', label: '03.Spring Boot 프로젝트 구조 이해', path: 'docs/01.SpringBoot3.4.x/03.Spring Boot 프로젝트 구조 이해.md' },
                        { type: 'file', label: '04.의존성 관리 (Dependency Management)', path: 'docs/01.SpringBoot3.4.x/04.의존성 관리 (Dependency Management).md' },
                        { type: 'file', label: '05.자동 설정 (Auto-Configuration)', path: 'docs/01.SpringBoot3.4.x/05.자동 설정 (Auto-Configuration).md' },
                        { type: 'file', label: '06.프로파일 (Profiles)', path: 'docs/01.SpringBoot3.4.x/06.프로파일 (Profiles).md' },
                        { type: 'file', label: '07.외부화된 설정 (Externalized Configuration)', path: 'docs/01.SpringBoot3.4.x/07.외부화된 설정 (Externalized Configuration).md' },
                        { type: 'file', label: '08.로깅 (Logging)', path: 'docs/01.SpringBoot3.4.x/08.로깅 (Logging).md' },
                        { type: 'file', label: '09.Web MVC 기초', path: 'docs/01.SpringBoot3.4.x/09.Web MVC 기초.md' },
                        { type: 'file', label: '10.RESTful API 개발', path: 'docs/01.SpringBoot3.4.x/10.RESTful API 개발.md' },
                        { type: 'file', label: '11.View 템플릿 엔진 (Thymeleaf)', path: 'docs/01.SpringBoot3.4.x/11.View 템플릿 엔진 (Thymeleaf).md' },
                        { type: 'file', label: '12.폼 처리 및 검증', path: 'docs/01.SpringBoot3.4.x/12.폼 처리 및 검증.md' },
                        { type: 'file', label: '13.예외 처리', path: 'docs/01.SpringBoot3.4.x/13.예외 처리.md' },
                        { type: 'file', label: '14.정적 리소스 처리', path: 'docs/01.SpringBoot3.4.x/14.정적 리소스 처리.md' },
                        { type: 'file', label: '15.파일 업로드 및 다운로드', path: 'docs/01.SpringBoot3.4.x/15.파일 업로드 및 다운로드.md' },
                        { type: 'file', label: '16.국제화 (i18n)와 지역화 (L10n)', path: 'docs/01.SpringBoot3.4.x/16.국제화 (i18n)와 지역화 (L10n).md' },
                        { type: 'file', label: '17.캐싱 (Caching)', path: 'docs/01.SpringBoot3.4.x/17.캐싱 (Caching).md' },
                        { type: 'file', label: '18.예약 작업 (Scheduling)', path: 'docs/01.SpringBoot3.4.x/18.예약 작업 (Scheduling).md' },
                        { type: 'file', label: '19.이메일 발송 (Email)', path: 'docs/01.SpringBoot3.4.x/19.이메일 발송 (Email).md' },
                        { type: 'file', label: '20.스케줄링 (Scheduling)', path: 'docs/01.SpringBoot3.4.x/20.스케줄링 (Scheduling).md' }
                    ]
                },
                {
                    type: 'folder',
                    label: 'Python 3.12',
                    path: 'docs/02.Python3.12',
                    children: [
                        { type: 'file', label: '01.Python 3.x 개요', path: 'docs/02.Python3.12/01.Python 3.x 개요.md' },
                        { type: 'file', label: '02.환경 설정 및 개발 도구', path: 'docs/02.Python3.12/02.환경 설정 및 개발 도구.md' },
                        { type: 'file', label: '03.기본 문법 및 데이터 타입', path: 'docs/02.Python3.12/03.기본 문법 및 데이터 타입.md' },
                        { type: 'file', label: '04.제어문 (제어 흐름)', path: 'docs/02.Python3.12/04.제어문 (제어 흐름).md' },
                        { type: 'file', label: '05.함수 (Functions)', path: 'docs/02.Python3.12/05.함수 (Functions).md' },
                        { type: 'file', label: '06.객체 지향 프로그래밍 (OOP)', path: 'docs/02.Python3.12/06.객체 지향 프로그래밍 (OOP).md' },
                        { type: 'file', label: '07.예외 처리 (Exception Handling)', path: 'docs/02.Python3.12/07.예외 처리 (Exception Handling).md' },
                        { type: 'file', label: '08.모듈과 패키지', path: 'docs/02.Python3.12/08.모듈과 패키지.md' },
                        { type: 'file', label: '09.파일 입출력 (File I/O)', path: 'docs/02.Python3.12/09.파일 입출력 (File I/O).md' },
                        { type: 'file', label: '10.고급 기능', path: 'docs/02.Python3.12/10.고급 기능.md' },
                        { type: 'file', label: '11.표준 라이브러리 활용', path: 'docs/02.Python3.12/11.표준 라이브러리 활용.md' },
                        { type: 'file', label: '12.가상 환경 (Virtual Environment)', path: 'docs/02.Python3.12/12.가상 환경 (Virtual Environment).md' },
                        { type: 'file', label: '13.패키지 관리 (pip)', path: 'docs/02.Python3.12/13.패키지 관리 (pip).md' },
                        { type: 'file', label: '14.디버깅과 테스트', path: 'docs/02.Python3.12/14.디버깅과 테스트.md' },
                        { type: 'file', label: '15.FastAPI 입문', path: 'docs/02.Python3.12/15.FastAPI 입문.md' }
                    ]
                }
            ];
            filteredData = [...docsData];
            renderDocsTree();
        }
    }

    // Render the docs tree
    function renderDocsTree() {
        if (!docsTree) return;
        docsTree.innerHTML = '';

        filteredData.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'docs-tree-item ' + item.type;
            itemElement.innerHTML = `
                <i data-lucide="${item.type === 'folder' ? 'folder' : 'file'}"></i>
                <span>${item.label}</span>
            `;
            itemElement.dataset.path = item.path || '';
            itemElement.dataset.type = item.type;

            if (item.type === 'file') {
                itemElement.addEventListener('click', () => {
                    // Remove active class from all items
                    docsTree.querySelectorAll('.docs-tree-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    // Add active class to clicked item
                    itemElement.classList.add('active');
                    // Load and display the markdown file
                    loadAndDisplayMarkdown(item.path || '');
                });
            }

docsTree.appendChild(itemElement);
        });

        // Update lucide icons
        if (window.lucide) {
            window.lucide.refresh();
        }
    }

        // Update lucide icons
        if (window.lucide) {
            window.lucide.refresh();
        }
    }

    // Load and display markdown content
    async function loadAndDisplayMarkdown(filePath) {
        try {
            const response = await fetch(`/${filePath}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}`);
            }
            const markdownContent = await response.text();
            displayMarkdown(markdownContent);
        } catch (error) {
            console.error('Error loading markdown:', error);
            displayMarkdown(`# Error loading document\n\nCould not load ${filePath}: ${error.message}`);
        }
    }

    // Display markdown content in the main area
    function displayMarkdown(markdownContent) {
        // Find the typing exercise area and replace it with markdown preview
        const practiceSection = document.querySelector('.practice');
        if (!practiceSection) return;

        // Create markdown container
        const markdownContainer = document.createElement('div');
        markdownContainer.className = 'markdown-preview';
        markdownContainer.innerHTML = marked.parse(markdownContent);

        // Clear the practice section and add markdown preview
        practiceSection.innerHTML = '';
        practiceSection.appendChild(markdownContainer);

        // Add a button to go back to typing practice
        const backButton = document.createElement('button');
        backButton.className = 'btn-ghost btn-sm mt-4';
        backButton.innerHTML = '<i data-lucide="keyboard"></i> 타이핑 연습으로 돌아가기';
        backButton.addEventListener('click', () => {
            // Reload the page to go back to typing practice
            // In a real app, we would have a proper state management
            location.reload();
        });

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'text-center mt-4';
        buttonContainer.appendChild(backButton);
        practiceSection.appendChild(buttonContainer);

        // Update lucide icons
        if (window.lucide) {
            window.lucide.refresh();
        }
    }

    // Search functionality
    function filterDocs(query) {
        const lowercaseQuery = query.toLowerCase().trim();
        if (!lowercaseQuery) {
            filteredData = [...docsData];
        } else {
            filteredData = docsData.filter(item => {
                if (item.type === 'folder') {
                    // For folder matches = item.children && item.children.some(child => 
                        child.label.toLowerCase().includes(lowercaseQuery));
                    return matches;
                } else {
                    return item.label.toLowerCase().includes(lowercaseQuery);
                }
            });
        }
        renderDocsTree();
    }

    // Event listeners
    docsNavClose.addEventListener('click', () => {
        docsNavigator.classList.add('hidden');
        sidebar.classList.remove('hidden');
        sidebarToggle.classList.remove('hidden');
        if (overlay) overlay.classList.remove('active');
    });

    docsSearch.addEventListener('input', (e) => {
        filterDocs(e.target.value);
    });

    // Toggle docs navigator from sidebar toggle button
    sidebarToggle.addEventListener('click', () => {
        docsNavigator.classList.remove('hidden');
        sidebar.classList.add('hidden');
        sidebarToggle.classList.add('hidden');
        if (overlay) overlay.classList.add('active');
    });

    // Clicking overlay closes the docs navigator
    if (overlay) {
        overlay.addEventListener('click', () => {
            docsNavigator.classList.add('hidden');
            sidebar.classList.remove('hidden');
            sidebarToggle.classList.remove('hidden');
            overlay.classList.remove('active');
        });
    }

    // Initial load
    loadDocsTree();
}