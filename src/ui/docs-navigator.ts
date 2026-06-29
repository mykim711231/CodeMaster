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
    const docsData: any[] = [];
    let filteredData: any[] = [];

    // Fetch documentation tree data
    async function loadDocsTree() {
        try {
            // Fetch the docs structure from the docs directory
            const response = await fetch('/docs-tree.json');
            if (!response.ok) throw new Error('Failed to load docs tree');
            const data = await response.json();
            docsData.splice(0, docsData.length, ...data);
            filteredData = [...docsData];
            renderDocsTree();
        } catch (error) {
            console.warn('Could not load docs tree from JSON, using fallback:', error);
            // Fallback: hardcoded structure based on the docs folders
            const fallbackData: any[] = [
                {
                    type: 'folder',
                    label: 'Spring Boot 3.4.x',
                    path: 'docs/01.SpringBoot3.4.x',
                    children: [
                        { type: 'file', label: '01.Java Core', path: 'docs/01.SpringBoot3.4.x/01.Java_Core.md' },
                        { type: 'file', label: '02.Spring Core', path: 'docs/01.SpringBoot3.4.x/02.Spring_Core.md' },
                        { type: 'file', label: '03.Spring MVC', path: 'docs/01.SpringBoot3.4.x/03.Spring_MVC.md' },
                        { type: 'file', label: '04.Database - JPA/MyBatis', path: 'docs/01.SpringBoot3.4.x/04.Database_-_JPAMyBatis.md' },
                        { type: 'file', label: '05.Concurrency', path: 'docs/01.SpringBoot3.4.x/05.Concurrency.md' },
                        { type: 'file', label: '06.Network', path: 'docs/01.SpringBoot3.4.x/06.Network.md' },
                        { type: 'file', label: '07.Gateway', path: 'docs/01.SpringBoot3.4.x/07.Gateway.md' },
                        { type: 'file', label: '08.Messaging', path: 'docs/01.SpringBoot3.4.x/08.Messaging.md' },
                        { type: 'file', label: '09.Batch', path: 'docs/01.SpringBoot3.4.x/09.Batch.md' },
                        { type: 'file', label: '10.Security', path: 'docs/01.SpringBoot3.4.x/10.Security.md' },
                        { type: 'file', label: '11.Cache', path: 'docs/01.SpringBoot3.4.x/11.Cache.md' },
                        { type: 'file', label: '12.Monitoring', path: 'docs/01.SpringBoot3.4.x/12.Monitoring.md' },
                        { type: 'file', label: '13.Testing', path: 'docs/01.SpringBoot3.4.x/13.Testing.md' },
                        { type: 'file', label: '14.Architecture', path: 'docs/01.SpringBoot3.4.x/14.Architecture.md' },
                        { type: 'file', label: '15.Design Pattern', path: 'docs/01.SpringBoot3.4.x/15.Design_Pattern.md' },
                        { type: 'file', label: '16.Build & DevOps', path: 'docs/01.SpringBoot3.4.x/16.Build_&_DevOps.md' },
                        { type: 'file', label: '17.Observability', path: 'docs/01.SpringBoot3.4.x/17.Observability.md' },
                        { type: 'file', label: '18.Data', path: 'docs/01.SpringBoot3.4.x/18.Data.md' },
                        { type: 'file', label: '19.Resilience & Cloud-Native', path: 'docs/01.SpringBoot3.4.x/19.Resilience_&_Cloud-Native.md' },
                        { type: 'file', label: '20.Reactive', path: 'docs/01.SpringBoot3.4.x/20.Reactive.md' }
                    ]
                },
                {
                    type: 'folder',
                    label: 'Python 3.12',
                    path: 'docs/02.Python3.12',
                    children: [
                        { type: 'file', label: '01.Python Language Basics', path: 'docs/02.Python3.12/01.Python_Language_Basics.md' },
                        { type: 'file', label: '02.Async', path: 'docs/02.Python3.12/02.Async.md' },
                        { type: 'file', label: '03.Data', path: 'docs/02.Python3.12/03.Data.md' },
                        { type: 'file', label: '04.Machine Learning', path: 'docs/02.Python3.12/04.Machine_Learning.md' },
                        { type: 'file', label: '05.Deep Learning', path: 'docs/02.Python3.12/05.Deep_Learning.md' },
                        { type: 'file', label: '06.LLM', path: 'docs/02.Python3.12/06.LLM.md' },
                        { type: 'file', label: '07.RAG', path: 'docs/02.Python3.12/07.RAG.md' },
                        { type: 'file', label: '08.AI Agent', path: 'docs/02.Python3.12/08.AI_Agent.md' },
                        { type: 'file', label: '09.Framework', path: 'docs/02.Python3.12/09.Framework.md' },
                        { type: 'file', label: '10.Production AI', path: 'docs/02.Python3.12/10.Production_AI.md' },
                        { type: 'file', label: '11.Vector Store', path: 'docs/02.Python3.12/11.Vector_Store.md' },
                        { type: 'file', label: '12.LLM Serving', path: 'docs/02.Python3.12/12.LLM_Serving.md' },
                        { type: 'file', label: '13.Prompt Structured', path: 'docs/02.Python3.12/13.Prompt_Structured.md' },
                        { type: 'file', label: '14.Fine Tuning & MLOps', path: 'docs/02.Python3.12/14.Fine_Tuning_MLOps.md' },
                        { type: 'file', label: '15.AI Quality', path: 'docs/02.Python3.12/15.AI_Quality.md' }
                    ]
                }
            ];
            filteredData = [...(docsData.length > 0 ? docsData : fallbackData)];
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
                    document.querySelectorAll('.docs-tree-item').forEach(el => {
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
        // @ts-ignore - lucide is loaded globally via CDN
        if (window.lucide) {
            // @ts-ignore - lucide is loaded globally via CDN
            window.lucide.refresh();
        }
    }

    // Load and display markdown content
    async function loadAndDisplayMarkdown(filePath: string) {
        try {
            const response = await fetch(`/${filePath}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}`);
            }
            const markdownContent = await response.text();
            displayMarkdown(markdownContent);
        } catch (error) {
            console.error('Error loading markdown:', error);
            displayMarkdown(`# Error loading document\n\nCould not load ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Display markdown content in the main area
    function displayMarkdown(markdownContent: string) {
        // Find the typing exercise area and replace it with markdown preview
        const practiceSection = document.querySelector('.practice');
        if (!practiceSection) return;

        // Create markdown container
        const markdownContainer = document.createElement('div');
        markdownContainer.className = 'markdown-preview';
        // @ts-ignore - marked is loaded globally via CDN
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
        // @ts-ignore - lucide is loaded globally via CDN
        if (window.lucide) {
            // @ts-ignore - lucide is loaded globally via CDN
            window.lucide.refresh();
        }
    }

    // Search functionality
    function filterDocs(query: string) {
        const lowercaseQuery = query.toLowerCase().trim();
        if (!lowercaseQuery) {
            filteredData = [...docsData];
        } else {
            filteredData = docsData.filter((item: any) => {
                if (item.type === 'folder') {
                    // For folders, check if any child matches
                    return item.children && item.children.some((child: any) => 
                        child.label.toLowerCase().includes(lowercaseQuery));
                } else {
                    // For files, check the label directly
                    return item.label.toLowerCase().includes(lowercaseQuery);
                }
            });
        }
        renderDocsTree();
    }

    // Event listeners
    docsNavClose.addEventListener('click', () => {
        if (docsNavigator) docsNavigator.classList.add('hidden');
        if (sidebar) sidebar.classList.remove('hidden');
        if (sidebarToggle) sidebarToggle.classList.remove('hidden');
        if (overlay) overlay.classList.remove('active');
    });

    if (docsSearch) {
        docsSearch.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            filterDocs(target.value);
        });
    }

    // Toggle docs navigator from sidebar toggle button
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            if (docsNavigator) docsNavigator.classList.remove('hidden');
            if (sidebar) sidebar.classList.add('hidden');
            if (sidebarToggle) sidebarToggle.classList.add('hidden');
            if (overlay) overlay.classList.add('active');
        });
    }

    // Clicking overlay closes the docs navigator
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (docsNavigator) docsNavigator.classList.add('hidden');
            if (sidebar) sidebar.classList.remove('hidden');
            if (sidebarToggle) sidebarToggle.classList.remove('hidden');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Initial load
    loadDocsTree();
}