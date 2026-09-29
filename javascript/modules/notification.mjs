export class NotificationBuilder {
  /**
   * Synthesizes audio feedback using the Web Audio API
   * @param {'notice' | 'success' | 'warning' | 'error'} type
   */
  static #playSound(type = "notice") {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const sounds = {
      notice: [
        { freq: 523.25, start: 0.0, duration: 0.12, type: "sine" }, // C5
        { freq: 783.99, start: 0.08, duration: 0.2, type: "sine" }, // G5
      ],
      success: [
        { freq: 523.25, start: 0.0, duration: 0.1, type: "sine" }, // C5
        { freq: 659.25, start: 0.08, duration: 0.1, type: "sine" }, // E5
        { freq: 1046.5, start: 0.16, duration: 0.3, type: "sine" }, // C6
      ],
      warning: [
        { freq: 440.0, start: 0.0, duration: 0.12, type: "triangle" }, // A4
        { freq: 440.0, start: 0.16, duration: 0.18, type: "triangle" }, // A4
      ],
      error: [
        { freq: 220.0, start: 0.0, duration: 0.15, type: "sawtooth" }, // A3
        { freq: 164.81, start: 0.12, duration: 0.3, type: "sawtooth" }, // E3
      ],
    };

    const sequence = sounds[type] || sounds.notice;

    sequence.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = note.type;
      osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.start);

      const volume = type === "error" ? 0.06 : 0.1;
      gain.gain.setValueAtTime(volume, ctx.currentTime + note.start);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + note.start + note.duration,
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + note.start);
      osc.stop(ctx.currentTime + note.start + note.duration);
    });
  }

  static #container() {
    let container = document.getElementById("notification-container-753");

    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container-753";
      document.body.prepend(container);
    }

    return container;
  }

  /**
   * Triggers a toast notification with sound
   * @param {string} message
   * @param {'notice' | 'success' | 'warning' | 'error'} type
   * @param {number} duration
   */
  static notification(message, type = "notice", duration = 3000) {
    NotificationBuilder.#playSound(type);

    const toast = document.createElement("div");
    toast.className = `notification-toast notification-${type}`;
    toast.innerHTML = message || "";

    NotificationBuilder.#container().prepend(toast);

    // Schedule the removal transition
    setTimeout(() => {
      // Find the inner notification element or target the toast directly
      const box = toast.querySelector(".notification-box-753") || toast;

      // Add the closing class to trigger the removal animation
      box.classList.add("removing");

      // Remove element from DOM after the exit animation completes
      box.addEventListener(
        "animationend",
        () => {
          toast.remove();
        },
        { once: true },
      );

      // Fallback safety cleanup in case animationend fails
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
}

export class Notification extends NotificationBuilder {
  static #notificationBox(icon, message, color = "notice") {
    const isString = typeof message === "string";
    const Message = {
      heading: !isString && Array.isArray(message) ? message[0] : "",
      paragraph: !isString && Array.isArray(message) ? message[1] : message,
    };

    return `
        <div class="notification-box-753 box" data-color="${color}">
            <div class="notification-box-753-icon">${icon || `<i class="ri-mail-fill"></i>`}</div>
            <div class="notification-box-753-text-box">
                ${Message.heading ? `<h3>${Message.heading}</h3>` : ""}
                <p>${Message.paragraph || ""}</p>
            </div>
        </div>
        `;
  }

  static notice(message = "", duration = 3000) {
    super.notification(
      this.#notificationBox(
        `<i class="ri-chat-2-fill"></i>`,
        message,
        "notice",
      ),
      "notice",
      duration,
    );
  }

  static success(message = "", duration = 3000) {
    super.notification(
      this.#notificationBox(
        `<i class="ri-shield-check-fill"></i>`,
        message,
        "success",
      ),
      "success",
      duration,
    );
  }

  static warning(message = "", duration = 3000) {
    super.notification(
      this.#notificationBox(
        `<i class="ri-alarm-warning-fill"></i>`,
        message,
        "warning",
      ),
      "warning",
      duration,
    );
  }

  static error(message = "", duration = 3000) {
    super.notification(
      this.#notificationBox(`<i class="ri-bug-fill"></i>`, message, "error"),
      "error",
      duration,
    );
  }
}


const nestedStyles = `
  #notification-container-753 {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: calc(100dvh - 3rem);
      padding: 0.25rem;
      pointer-events: none;
      overflow-y: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
          display: none;
      }
  }

  .notification-box-753 {
      /* Theme & Status Color Mapping */
      --accent-color: #2373F4;
      --accent-subtle: hsl(from var(--accent-color) h s l / 0.12);

      &[data-color="notice"] {
          --accent-color: #2373F4;
      }

      &[data-color="success"] {
          --accent-color: #43A047;
      }

      &[data-color="warning"] {
          --accent-color: #E6A23C;
      }

      &[data-color="error"] {
          --accent-color: #E53935;
      }

      /* Card Alignment & Layout */
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.875rem;
      width: clamp(18rem, 24rem, 28rem);
      padding: 0.75rem 0.875rem;
      
      /* Matching design variables */
      background-color: var(--box-color);
      color: var(--text-color);
      border-radius: 0.3rem;
      border: 1px solid hsl(from var(--text-color) h s l / 0.15);
      border-left: 0.35rem solid var(--accent-color);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);

      .notification-box-753-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.35rem;
          color: var(--accent-color);
          margin-top: 0.1rem;
      }

      .notification-box-753-text-box {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
          flex: 1;

          h3 {
              margin: 0;
              font-size: 1rem;
              font-weight: 700;
              color: var(--text-color);
              line-height: 1.3;
              letter-spacing: -0.01em;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          p {
              margin: 0;
              font-size: 0.78125rem;
              font-weight: 400;
              color: hsl(from var(--text-color) h s l / 0.75);
              line-height: 1.4;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
          }
      }

      /* Entrance & Exit Animations */
      will-change: transform, opacity;
      animation: appear 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

      &.removing {
          animation: disappear 0.25s ease-in forwards;
      }
  }

  @keyframes appear {
      from {
          opacity: 0;
          transform: translateY(-10px) scale(0.98);
      }
      to {
          opacity: 1;
          transform: translateY(0) scale(1);
      }
  }

  @keyframes disappear {
      from {
          opacity: 1;
          transform: translateY(0) scale(1);
          max-height: 100px;
          margin-bottom: 0;
      }
      to {
          opacity: 0;
          transform: translateY(-6px) scale(0.96);
          max-height: 0;
          margin-bottom: -0.75rem;
      }
  }
`;

const styleElement = document.createElement('style');
styleElement.textContent = nestedStyles;
document.head.appendChild(styleElement);