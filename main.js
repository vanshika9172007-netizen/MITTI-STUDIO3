(function () {
    'use strict';

    // Mobile navigation
    const toggle = document.querySelector('.nav-toggle');
    const nav = document.getElementById('site-nav');

    function setMenu(open) {
        if (!toggle || !nav) return;

        nav.classList.toggle('is-open', open);
        // The button keeps the same name ("Menu"); aria-expanded tells
        // screen readers whether it is open, and the icon turns into an X
        toggle.setAttribute('aria-expanded', String(open));
    }

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });

        nav.addEventListener('click', function (event) {
            if (event.target.closest('a, button.book-class')) {
                setMenu(false);
            }
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' &&
                toggle.getAttribute('aria-expanded') === 'true') {
                setMenu(false);
                toggle.focus();
            }
        });

        // Keep the menu closed on larger screens
        if (window.matchMedia) {
            const desktopQuery = window.matchMedia('(min-width: 900px)');

            if (desktopQuery.addEventListener) {
                desktopQuery.addEventListener('change', function (event) {
                    if (event.matches) setMenu(false);
                });
            } else if (desktopQuery.addListener) {
                // Fallback for older browsers
                desktopQuery.addListener(function (event) {
                    if (event.matches) setMenu(false);
                });
            }
        }
    }

    // Header shadow when scrolling
    const header = document.querySelector('.site-header');

    function updateHeader() {
        if (header) {
            header.classList.toggle('is-scrolled', window.scrollY > 8);
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    // Email signup form
    const form = document.querySelector('.join-form');
    const emailInput = document.getElementById('email');

    if (form && emailInput) {
        const message = form.querySelector('.form-message');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const value = emailInput.value.trim();
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

            message.classList.remove('is-error', 'is-success');
            emailInput.setAttribute('aria-invalid', String(!valid));

            if (!valid) {
                message.textContent =
                    'Enter an email address like you@example.com.';
                message.classList.add('is-error');
                emailInput.focus();
                return;
            }

            message.textContent =
                'Thanks. We will email the dates to ' + value + '.';
            message.classList.add('is-success');
            form.reset();
            emailInput.removeAttribute('aria-invalid');
        });
    }

    // Keep the footer year up to date
    const year = document.getElementById('year');

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // Class booking modal (Week 2)
    const modal = document.getElementById('booking-modal');
    const openButtons = document.querySelectorAll('.book-class');
    const closeButton = document.querySelector('.modal-close');
    const bookingForm = document.getElementById('booking-form');
    const bookingMessage = document.getElementById('booking-message');
    const firstField = document.getElementById('class-type');

    // If any part of the modal is missing, leave the rest of the site working
    if (!modal || !openButtons.length || !closeButton ||
        !bookingForm || !bookingMessage || !firstField) {
        return;
    }

    // Native <dialog> methods are used when available (feature detection)
    const supportsDialog = typeof modal.showModal === 'function' &&
        typeof modal.close === 'function';
    const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // same rule as the signup form
    let lastFocusedElement = null;

    function isVisible(element) {
        return Boolean(element && element.getClientRects().length);
    }

    function isModalOpen() {
        return modal.hasAttribute('open');
    }

    // Returns an error message for a field, or '' when the value is valid
    function getFieldError(field) {
        const value = field.value.trim();

        if (field.id === 'class-type') {
            return value ? '' : 'Choose a class from the list.';
        }
        if (field.id === 'booking-name') {
            return value ? '' : 'Enter your full name.';
        }
        if (field.id === 'booking-email') {
            if (!value) return 'Enter your email address.';
            return EMAIL_PATTERN.test(value)
                ? '' : 'Enter an email address like you@example.com.';
        }
        if (field.id === 'booking-seats') {
            const seats = Number(value);
            return seats >= 1 && seats <= 6
                ? '' : 'Choose between 1 and 6 seats.';
        }
        return '';
    }

    // Shows or clears the error for one field (red border + text + aria-invalid)
    function showFieldError(field, text) {
        const errorElement = document.getElementById(field.id + '-error');

        if (text) {
            field.setAttribute('aria-invalid', 'true');
        } else {
            field.removeAttribute('aria-invalid');
        }
        if (errorElement) errorElement.textContent = text;
    }

    function clearFeedback() {
        bookingMessage.textContent = '';
        bookingMessage.classList.remove('is-error', 'is-success');
        bookingForm.querySelectorAll('input, select').forEach(function (field) {
            showFieldError(field, '');
        });
    }

    function openModal(event) {
        if (isModalOpen()) return;

        lastFocusedElement = event.currentTarget;
        clearFeedback();

        if (supportsDialog) {
            modal.showModal();
        } else {
            // Basic fallback: show the dialog manually
            modal.setAttribute('open', '');
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-modal', 'true');
            modal.classList.add('booking-modal--fallback');
        }

        document.body.classList.add('modal-open'); // stop background scrolling
        modal.scrollTop = 0; // always start at the title
        firstField.focus();
    }

    // Runs after the modal has closed by any route (button, Escape, backdrop)
    function handleClosed() {
        document.body.classList.remove('modal-open');
        modal.classList.remove('booking-modal--fallback');

        // The opener can be hidden (e.g. the mobile menu closes), so fall
        // back to the menu button to avoid losing keyboard focus
        if (isVisible(lastFocusedElement)) {
            lastFocusedElement.focus();
        } else if (isVisible(toggle)) {
            toggle.focus();
        }
    }

    function closeModal() {
        if (!isModalOpen()) return;

        if (supportsDialog) {
            modal.close(); // fires the "close" event, which calls handleClosed()
        } else {
            modal.removeAttribute('open');
            modal.removeAttribute('role');
            modal.removeAttribute('aria-modal');
            handleClosed();
        }
    }

    openButtons.forEach(function (button) {
        button.addEventListener('click', openModal);
    });

    closeButton.addEventListener('click', closeModal);

    // Native dialog: Escape and close() both end up here
    modal.addEventListener('close', handleClosed);

    // Escape key for the fallback (the native dialog handles it itself)
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !supportsDialog) closeModal();
    });

    // Backdrop clicks. A click on the dialog's own padding also has
    // event.target === modal, so compare the pointer position with the
    // dialog box. The press must also START on the backdrop, so dragging a
    // text selection out of a field does not close the modal.
    let pressStartedOnBackdrop = false;

    function isOutsideDialogBox(event) {
        if (event.target !== modal) return false;
        const box = modal.getBoundingClientRect();
        return event.clientX < box.left || event.clientX > box.right ||
            event.clientY < box.top || event.clientY > box.bottom;
    }

    modal.addEventListener('mousedown', function (event) {
        pressStartedOnBackdrop = isOutsideDialogBox(event);
    });

    modal.addEventListener('click', function (event) {
        if (pressStartedOnBackdrop && isOutsideDialogBox(event)) closeModal();
        pressStartedOnBackdrop = false;
    });

    // Fallback only: the dimmed area is not part of the dialog element
    document.addEventListener('click', function (event) {
        if (supportsDialog || !isModalOpen()) return;
        if (modal.contains(event.target) || event.target.closest('.book-class')) return;
        closeModal();
    });

    // Validate and handle the demo booking form
    bookingForm.addEventListener('submit', function (event) {
        event.preventDefault(); // no page reload

        let firstInvalidField = null;

        bookingForm.querySelectorAll('input, select').forEach(function (field) {
            const errorText = getFieldError(field);
            showFieldError(field, errorText);

            if (errorText && !firstInvalidField) firstInvalidField = field;
        });

        bookingMessage.classList.remove('is-error', 'is-success');

        if (firstInvalidField) {
            bookingMessage.textContent =
                'Please fix the highlighted fields and try again.';
            bookingMessage.classList.add('is-error');
            firstInvalidField.focus();
            return;
        }

        const name = document.getElementById('booking-name').value.trim();
        const seats = Number(document.getElementById('booking-seats').value);
        const className = firstField.value;

        bookingMessage.textContent =
            'Demo only: thank you, ' + name + '. Nothing was booked and no ' +
            'email was sent. (Your request was ' + seats +
            (seats === 1 ? ' seat' : ' seats') + ' in ' + className + '.)';
        bookingMessage.classList.add('is-success');

        bookingForm.reset();
    });

    // Remove a field's error as soon as it becomes valid
    bookingForm.querySelectorAll('input, select').forEach(function (field) {
        function clearIfFixed() {
            if (field.hasAttribute('aria-invalid') && !getFieldError(field)) {
                showFieldError(field, '');
            }
        }

        field.addEventListener('input', clearIfFixed);
        field.addEventListener('change', clearIfFixed);
    });

    // Keep keyboard focus inside the modal while it is open
    // (the native dialog already does this; the fallback needs it)
    modal.addEventListener('keydown', function (event) {
        if (event.key !== 'Tab' || !isModalOpen()) return;

        const focusable = modal.querySelectorAll(
            'button:not(:disabled), input:not(:disabled), select:not(:disabled)'
        );

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
})();