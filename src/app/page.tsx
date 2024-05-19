'use client';
import { useEffect, useState } from 'react';

const TEXT_STORAGE_KEY = 'text';
const THEME_STORAGE_KEY = 'theme';
const DEFAULT_TEXT = `Hi, everyone! 👋

My name is Dimas Miftah 🏂

I ship websites 🛩️

https://instagram.com/dimas.mfth`;

export default function Home() {
  const [text, setText] = useState('');
  const [slides, setSlides] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    localStorage.setItem(TEXT_STORAGE_KEY, event.target.value);
  };

  const handleResetText = () => {
    setText('');
    localStorage.setItem(TEXT_STORAGE_KEY, '');
  };

  const handleSubmit = () => {
    if (!text) return alert('Please enter some text.');

    const formattedSlides = text
      .split('\n\n')
      .map((slide) => {
        // Replace newlines with <br/>
        const formattedSlide = slide.trim().split('\n').join('<br/>');

        // Wrap URLs with <a> tags and add break-all class
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const slideWithLinks = formattedSlide.replace(
          urlRegex,
          '<a href="$1" target="_blank" rel="noopener noreferrer" class="break-all">$1</a>'
        );

        return slideWithLinks;
      })
      .filter(Boolean);

    setSlides(formattedSlides);
  };

  const handleReset = () => {
    setSlides([]);
    setActiveSlide(0);
    window.history.pushState({}, document.title, window.location.pathname);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleShare = () => {
    const slidesEncoded = encodeURIComponent(slides.join('\n\n'));
    const url = `${window.location.origin}?slides=${slidesEncoded}`;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => alert('Copied the URL to your clipboard!'))
        .catch((error) => {
          console.error('Unable to copy URL to clipboard:', error);
          fallbackCopyTextToClipboard(url);
        });
    } else {
      fallbackCopyTextToClipboard(url);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      alert('Copied the URL to your clipboard!');
    } catch (err) {
      console.error('Unable to copy URL to clipboard:', err);
      alert('Failed to copy the URL to your clipboard. Please copy it manually.');
    }

    document.body.removeChild(textArea);
  };

  const handleToggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');

      return newTheme;
    });
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    setTheme(storedTheme === 'dark' ? 'dark' : 'light');

    const url = new URL(window.location.href);
    const slidesFromURL = url.searchParams.get('slides');

    if (slidesFromURL) {
      setText(decodeURIComponent(slidesFromURL));
      setSlides(slidesFromURL.split('\n\n'));

      return;
    }

    const storedText = localStorage.getItem(TEXT_STORAGE_KEY);
    setText(storedText || DEFAULT_TEXT);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'Escape') {
        handleReset();
      } else if (event.key === 'Enter' && event.metaKey) {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, slides, theme]);

  const renderThemeToggle = () => (
    <button className={`w-10 h-10 md:w-16 md:h-16 color-scheme`} onClick={handleToggleTheme}>
      {theme === 'dark' ? '🌞' : '🌚'}
    </button>
  );

  return slides.length > 0 ? (
    <main className='flex flex-col items-center justify-center w-screen h-svh p-4 md:p-8 lg:p-60 box-border'>
      <h1
        className='text-2xl md:text-5xl lg:text-6xl font-semibold leading-snug'
        dangerouslySetInnerHTML={{ __html: slides[activeSlide] }}
      />
      <nav className='flex justify-center gap-1 md:gap-2 fixed bottom-4 right-4 left-1/2 transform -translate-x-1/2 w-full'>
        {renderThemeToggle()}
        <button className={`w-10 h-10 md:w-16 md:h-16 color-scheme`} onClick={handleShare}>
          🔗
        </button>
        <button
          className={`w-10 h-10 md:w-16 md:h-16 color-scheme`}
          onClick={() =>
            alert(`
          Use the left (<) and right (>) arrow keys to navigate through the slides.
          Press the escape (esc) key to exit the presentation.
        `)
          }
        >
          ?
        </button>
        <button className={`w-16 h-10 md:h-16 color-scheme`} onClick={handleNext}>
          {activeSlide + 1} / {slides.length}
        </button>
        <button className={`w-10 h-10 md:w-16 md:h-16 color-scheme`} onClick={handleReset}>
          {'x'}
        </button>
        <button className={`w-10 h-10 md:w-16 md:h-16 color-scheme`} onClick={handlePrev}>
          {'<'}
        </button>
        <button className={`w-10 h-10 md:w-16 md:h-16 color-scheme`} onClick={handleNext}>
          {'>'}
        </button>
      </nav>
    </main>
  ) : (
    <main className='flex w-screen h-svh flex-col items-center justify-center gap-4 px-4 md:px-8 lg:px-16 box-border'>
      <h1 className='text-2xl md:text-5xl lg:text-6xl font-bold'>Text 2 Slide</h1>
      <p className='text-md md:text-lg lg:text-xl'>
        Convert your text into slides. Separate your slides with an empty line.
      </p>
      <form className='flex flex-col gap-4'>
        <textarea
          className={`w-full p-2 md:p-4 lg:p-8 color-scheme`}
          placeholder='Type your text...'
          onChange={handleChange}
          value={text}
          autoFocus
          rows={10}
          cols={80}
          required
        />
        <button type='button' className={`p-2 md:p-4 color-scheme`} onClick={handleResetText}>
          Reset
        </button>
        <button type='button' className={`p-2 md:p-4 color-scheme`} onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <nav className='flex gap-2 fixed bottom-4 right-4'>{renderThemeToggle()}</nav>
    </main>
  );
}
