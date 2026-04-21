/*!
* Start Bootstrap - Clean Blog v6.0.9 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/
const initMainNav = () => {
    const mainNav = document.getElementById('mainNav');
    if (!mainNav) {
        return;
    }

    let scrollPos = 0;
    const headerHeight = mainNav.clientHeight;

    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if (currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove('is-visible');
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
};

const initFavoriteBooks = () => {
    const favoriteBookItems = document.querySelectorAll('.favorite-book-item[data-book-target]');
    const shelfBooks = document.querySelectorAll('.book[data-book-id]');

    if (!favoriteBookItems.length || !shelfBooks.length) {
        return;
    }

    let previewItem = null;
    let activeItem = null;
    let activeTimeoutId = null;

    const clearListHighlights = () => {
        favoriteBookItems.forEach((item) => {
            item.classList.remove('is-selected');
            item.classList.remove('is-previewed');
            item.setAttribute('aria-pressed', 'false');
        });
    };

    const clearShelfHighlights = () => {
        shelfBooks.forEach((book) => {
            book.classList.remove('is-linked-highlight');
            book.classList.remove('is-selected-book');
        });
    };

    const getMatchedBook = (item) => {
        const targetId = item?.dataset.bookTarget;
        return document.querySelector(`.book[data-book-id="${targetId}"]`);
    };

    const syncBookHighlights = ({ scrollToMatch = false } = {}) => {
        clearShelfHighlights();

        clearListHighlights();

        if (activeItem) {
            activeItem.classList.add('is-selected');
            activeItem.setAttribute('aria-pressed', 'true');
        }

        if (previewItem && previewItem !== activeItem) {
            previewItem.classList.add('is-previewed');
        }

        const selectedBook = activeItem ? getMatchedBook(activeItem) : null;
        const previewBookMatch = previewItem ? getMatchedBook(previewItem) : null;

        if (selectedBook) {
            selectedBook.classList.add('is-selected-book');
        }

        if (!previewBookMatch) {
            return;
        }

        if (previewBookMatch !== selectedBook) {
            previewBookMatch.classList.add('is-linked-highlight');
        }

        if (scrollToMatch) {
            (selectedBook || previewBookMatch).scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        }
    };

    const activateBook = (item) => {
        if (activeTimeoutId) {
            window.clearTimeout(activeTimeoutId);
        }

        activeItem = item;
        syncBookHighlights({ scrollToMatch: true });

        activeTimeoutId = window.setTimeout(() => {
            activeTimeoutId = null;
            activeItem = null;
            syncBookHighlights();
        }, 1200);
    };

    const previewBook = (item) => {
        previewItem = item;
        syncBookHighlights();
    };

    const clearPreview = (item) => {
        if (previewItem === item) {
            previewItem = null;
            syncBookHighlights();
        }
    };

    favoriteBookItems.forEach((item) => {
        item.addEventListener('click', () => {
            activateBook(item);
        });

        item.addEventListener('mouseenter', () => {
            previewBook(item);
        });

        item.addEventListener('mouseleave', () => {
            clearPreview(item);
        });

        item.addEventListener('focus', () => {
            previewBook(item);
        });

        item.addEventListener('blur', () => {
            clearPreview(item);
        });

        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activateBook(item);
            }
        });
    });
};

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => {
        initMainNav();
        initFavoriteBooks();
    });
} else {
    initMainNav();
    initFavoriteBooks();
}
