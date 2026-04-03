// main.js
document.addEventListener('DOMContentLoaded', () => {

    // ==================== Thème ====================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        html.classList.add('dark');
        if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (html.classList.contains('dark')) {
                html.classList.remove('dark');
                localStorage.setItem('theme', 'light');
                if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
            } else {
                html.classList.add('dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
            }
        });
    }

    // ==================== Protection des liens ====================
    // assistant.html → محمي (يتطلب تسجيل دخول)
    // services.html → مفتوح للجميع (بدون حماية)

    function checkAndRedirectForAssistant(e, page) {
        e.preventDefault();
        const studentId = localStorage.getItem('student_id');
        if (!studentId) {
            localStorage.setItem('redirect_after_login', page);
            window.location.href = 'login.html';
        } else {
            window.location.href = page;
        }
    }

    const btnAssistant = document.getElementById('btnAssistant');
    const btnServices = document.getElementById('btnServices');

    // فقط assistant هو المحمي
    if (btnAssistant) {
        btnAssistant.addEventListener('click', (e) => checkAndRedirectForAssistant(e, 'assistant.html'));
    }

    // services مفتوح للجميع - لا حماية
    if (btnServices) {
        btnServices.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'services.html';
        });
    }

    // --- كود النافذة المنبثقة (يوضع في نهاية ملف main.js) ---
    const studentId = localStorage.getItem('student_id');
    const authZone = document.getElementById('auth-zone');

    if (studentId && authZone) {
        const firstName = localStorage.getItem('first_name') || 'Student';
        const email = localStorage.getItem('email') || '';

        // هنا يتم حذف زر LOG IN ووضع النافذة مكانه تلقائياً
        authZone.innerHTML = `
            <div class="relative inline-block text-left">
                <button id="user-menu-btn" class="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/50 dark:border-slate-700/50">
                    <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        ${firstName[0].toUpperCase()}
                    </div>
                    <i class="fa-solid fa-chevron-down text-[10px] text-slate-400"></i>
                </button>

                <div id="user-dropdown" class="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl hidden z-[110]">
                    <div class="p-4 border-b border-slate-100 dark:border-slate-800">
                        <p class="font-bold text-slate-900 dark:text-white truncate text-sm">${firstName}</p>
                        <p class="text-[10px] text-slate-500 truncate">${email}</p>
                    </div>
                    <div class="p-2">
                        <button id="logout-btn" class="w-full flex items-center gap-2 p-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors font-medium">
                            <i class="fa-solid fa-right-from-bracket"></i> تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
        `;

        const menuBtn = document.getElementById('user-menu-btn');
        const dropdown = document.getElementById('user-dropdown');
        
        // فتح وإغلاق القائمة عند الضغط على الأيقونة
        if (menuBtn) {
            menuBtn.onclick = (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            };
        }

        // إغلاق القائمة إذا ضغط المستخدم في أي مكان خارجها
        document.addEventListener('click', () => {
            if (dropdown) dropdown.classList.add('hidden');
        });

        // منطق زر تسجيل الخروج
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.onclick = () => {
                localStorage.clear(); // مسح بيانات المستخدم
                window.location.reload(); // إعادة تحميل الصفحة لإظهار زر Login مجدداً
            };
        }
    }
});