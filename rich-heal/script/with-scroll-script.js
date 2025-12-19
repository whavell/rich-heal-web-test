// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function() {
    
    // ========== 풀페이지 스크롤 기능 ==========
    const fullpageWrapper = document.querySelector('.fullpage-wrapper');
    const fullpageSections = document.querySelectorAll('.fullpage-section');
    let currentSection = 0;
    let isScrolling = false;
    let touchStartY = 0;
    let touchEndY = 0;

    const header = document.querySelector('.header');
    const header_container = document.querySelector('.header-container');
    const logoImg = document.querySelector('.logo');
    const navItems = document.querySelectorAll('.nav-item > a');
    const headerRightElements = document.querySelectorAll('.header-right > *');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenuBtnSpans = mobileMenuBtn ? mobileMenuBtn.querySelectorAll('span') : [];
    const sections = Array.from(fullpageSections);

    // 개발자 도구 금지
    document.addEventListener('keydown', function(event) {
    if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
        event.preventDefault();
        // 개발자 도구 단축키로 실행 시도를 막는 코드
        console.log("개발자 도구 차단 완료");
    }
    });

    // 섹션으로 이동하는 함수
    function goToSection(index) {
        if (index < 0 || index >= sections.length || isScrolling) return;
        
        isScrolling = true;
        currentSection = index;
        const offset = -currentSection * 100;
        fullpageWrapper.style.transform = `translateY(${offset}vh)`;
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        
        updateHeaderStyle(index);
        updateIndicator();
        
        setTimeout(() => { 
            isScrolling = false;
        }, 1000); 
    }

    // ========== 스크롤 시 헤더 스타일 변경 함수 ==========
    function updateHeaderStyle(index) {
        const isFirstSection = index === 0;
        const isMobile = window.innerWidth <= 768;

        if (isFirstSection) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
            header.classList.remove('scrolled');
            
            if (isMobile) {
                header_container.style.cssText = "height: 80px;"
            } else {
                header_container.style.cssText = "height: 130px;"
            }
            
            if (logoImg && document.title == "RICH HEAL") {
                header.style.backgroundColor = 'rgba(255, 255, 255, 0)';
                if (isMobile) {
                    logoImg.style.cssText = 'top: 22px;';
                } else {
                    logoImg.style.cssText = 'top: 30px;';
                }
                navItems.forEach(a => a.style.color = 'white');
                headerRightElements.forEach(el => el.style.color = 'white');
                // 모바일 메뉴 버튼 색상
                if (mobileMenuBtn && !mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtnSpans.forEach(span => span.style.backgroundColor = 'white');
                }
            } 
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            header.classList.add('scrolled');
            header_container.style.cssText = "height: 100px;"
            if (logoImg && document.title == "RICH HEAL") {
                logoImg.style.cssText = 'top: 20px;';
                navItems.forEach(a => a.style.color = '#333');
                headerRightElements.forEach(el => el.style.color = '#333');
                // 모바일 메뉴 버튼 색상
                if (mobileMenuBtn && !mobileMenuBtn.classList.contains('active')) {
                    mobileMenuBtnSpans.forEach(span => span.style.backgroundColor = '#333');
                }
            }
        }
    }
    
    updateHeaderStyle(currentSection);

    // 휠 이벤트 처리
    function handleWheel(e) {
        if (isScrolling) return;
        
        e.preventDefault();
        
        if (e.deltaY > 0) {
            if (currentSection < sections.length - 1) {
                goToSection(currentSection + 1);
            }
        } else {
            if (currentSection > 0) {
                goToSection(currentSection - 1);
            }
        }
    }

    // 터치 이벤트 처리 (모바일)
    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (isScrolling) return;
    }

    function handleTouchEnd(e) {
        if (isScrolling) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0 && currentSection < sections.length - 1) {
                goToSection(currentSection + 1);
            } else if (diff < 0 && currentSection > 0) {
                goToSection(currentSection - 1);
            }
        }
    }

    // 키보드 이벤트 처리
    function handleKeyDown(e) {
        if (isScrolling) return;
        
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            if (currentSection < sections.length - 1) {
                goToSection(currentSection + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goToSection(currentSection - 1);
        } else if (e.key === 'Home') {
            e.preventDefault();
            goToSection(0);
        } else if (e.key === 'End') {
            e.preventDefault();
            goToSection(sections.length - 1);
        }
    }

    // 이벤트 리스너 등록
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // ========== 모바일 메뉴 토글 ==========
    const nav = document.querySelector('.nav');
    const headerRight = document.querySelector('.header-right');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
            // headerRight.classList.toggle('active');
            document.body.classList.toggle('menu-open');

            // 메뉴가 열렸을 때는 항상 검은색
            if (this.classList.contains('active')) {
                mobileMenuBtnSpans.forEach(span => span.style.backgroundColor = '#333');
            } else {
                // 메뉴가 닫혔을 때는 현재 섹션에 따라 색상 결정
                if (currentSection !== 0) {
                    mobileMenuBtnSpans.forEach(span => span.style.backgroundColor = '#333');
                } else {
                    mobileMenuBtnSpans.forEach(span => span.style.backgroundColor = 'white');
                }
            }
        });
    }

    // ========== 부드러운 스크롤 (네비게이션 링크) ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#none') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const targetIndex = Array.from(sections).indexOf(target);
                    if (targetIndex !== -1) {
                        goToSection(targetIndex);
                    }

                    if (mobileMenuBtn && mobileMenuBtn.classList.contains('active')) {
                        mobileMenuBtn.classList.remove('active');
                        nav.classList.remove('active');
                        headerRight.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                }
            }
        });
    });
    
    // ========== Intersection Observer를 사용한 스크롤 애니메이션 ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.brand-card, .philosophy-item, .solutions-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // ========== 드롭다운 메뉴 터치 이벤트 (모바일) ==========
    const navItemsWithDropdown = document.querySelectorAll('.nav-item');
    
    navItemsWithDropdown.forEach(item => {
        const dropdown = item.querySelector('.dropdown');
        if (dropdown) {
            let navTouchStartY = 0;
            
            item.addEventListener('touchstart', function(e) {
                navTouchStartY = e.touches[0].clientY;
            });
            
            item.addEventListener('touchend', function(e) {
                const navTouchEndY = e.changedTouches[0].clientY;
                const touchDiff = navTouchStartY - navTouchEndY;
                
                if (Math.abs(touchDiff) < 10) {
                    e.preventDefault();
                    const allDropdowns = document.querySelectorAll('.dropdown');
                    allDropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('show');
                        }
                    });
                    dropdown.classList.toggle('show');
                }
                if(e.target.innerHTML == "KOREAN"){
                    location.href="../kor-pages/brand-page.html"
                }
                else if(e.target.innerHTML == "ENGLISH"){
                    location.href="../eng-pages/(eng)brand-page.html"
                }
            });
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-item')) {
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
        }
    });

    // ========== 이미지 레이지 로딩 ==========
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========== 폼 유효성 검사 ==========
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('필수 항목을 모두 입력해주세요.');
            }
        });
    });

    // ========== 디바운스 함수 ==========
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                // func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ========== 리사이즈 이벤트 최적화 ==========
    const handleResize = debounce(function() {
        const width = window.innerWidth;
        
        if (width > 768) {
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
                nav.classList.remove('active');
                headerRight.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                if (currentSection !== 0) {
                    mobileMenuBtnSpans.forEach(span => span.style.backgroundColor = '#333');
                } else {
                    mobileMenuBtnSpans.forEach(span => span.style.backgroundColor = 'white');
                }
            }
        }
        
        // 현재 섹션 스타일 재적용
        updateHeaderStyle(currentSection);
    }, 250);

    window.addEventListener('resize', handleResize);

    // ========== 섹션 네비게이션 인디케이터 ==========
    function createSectionIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'section-indicator';

        indicator.innerHTML = sections.length > 0 ? 
            Array.from(sections).map((_, i) => {
                return `<span data-index="${i}"></span>`;
            }).join('') : '';

        document.body.appendChild(indicator);

        indicator.addEventListener('click', function(e) {
            if (e.target.tagName === 'SPAN') {
                const index = parseInt(e.target.dataset.index);
                goToSection(index);
            }
        });
    }

    function updateIndicator() {
        const indicator = document.querySelector('.section-indicator');
        if (indicator) {
            indicator.querySelectorAll('span').forEach((span, i) => {
                span.classList.toggle('active', i === currentSection);
            });
        }
    }

    createSectionIndicator();
    updateIndicator();
});

// ========== 모바일 메뉴 스타일 ==========
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .header {
            z-index: 1000;
        }
        
        .nav {
            position: fixed;
            top: 80px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 80px);
            background: #fff;
            transition: left 0.3s ease;
            overflow-y: auto;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 1001;
            display: block !important;
        }

        .nav.active {
            left: 0;
        }

        .nav-list {
            flex-direction: column;
            gap: 0;
            padding: 20px;
        }

        .nav-item {
            border-bottom: 1px solid #e5e5e5;
        }

        .nav-item > a {
            padding: 15px 0;
            color: #333 !important;
        }

        .dropdown {
            position: static;
            opacity: 1;
            visibility: visible;
            transform: none;
            box-shadow: none;
            background: #f9f9f9;
            display: none;
        }

        .dropdown.show {
            display: block;
        }

        .header-right {
            position: fixed;
            bottom: 0;
            left: -100%;
            width: 100%;
            background: #fff;
            padding: 20px;
            display: flex !important;
            justify-content: space-around;
            border-top: 1px solid #e5e5e5;
            transition: left 0.3s ease;
            z-index: 1001;
        }

        .header-right.active {
            left: 0;
        }

        .mobile-menu-btn {
            z-index: 1002;
        }

        .mobile-menu-btn span {
            background: #333; 
        }

        .mobile-menu-btn.active span {
            background: #333 !important;
        }

        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }

        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }

        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }

        body.menu-open {
            overflow: hidden;
        }
    }

    @media (max-width: 480px) {
        .nav {
            top: 70px;
            height: calc(100vh - 70px);
        }
    }

    .fade-in {
        animation: fadeInUp 0.8s ease-out;
    }

    .section-indicator {
        position: fixed;
        right: 50px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 999;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .section-indicator span {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        border: 0.5px solid rgba(0, 0, 0, 0.5);
        cursor: pointer;
        transition: all 0.3s;
    }

    .section-indicator span:hover {
        background: rgba(255, 255, 255, 0.5);
        transform: scale(1.2);
    }

    .section-indicator span.active {
        background: rgb(200, 200, 200);
        transform: scale(1.5);
    }

    @media (max-width: 768px) {
        .section-indicator {
            right: 15px;
        }

        .section-indicator span {
            width: 10px;
            height: 10px;
        }
    }
`;
document.head.appendChild(style);