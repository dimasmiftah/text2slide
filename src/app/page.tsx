'use client';
import { useEffect, useState } from 'react';

const TEXT_STORAGE_KEY = 'text';
const THEME_STORAGE_KEY = 'theme';
const DEFAULT_TEXT = `Hi, everyone! 👋

My name is Dimas Miftah 🏂

I ship websites 🛩️

https://instagram.com/dimas.mfth`;

export default function Home() {
  const [text, setText] = useState(localStorage?.getItem(TEXT_STORAGE_KEY) || DEFAULT_TEXT);
  const [slides, setSlides] = useState<string[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(localStorage?.getItem(THEME_STORAGE_KEY) as 'light' | 'dark');

  const colorClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black';

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
    localStorage.setItem(TEXT_STORAGE_KEY, event.target.value);
  };

  const handleSubmit = () => {
    if (!text) return alert('Please enter some text.');

    setSlides(
      text
        .split('\n\n')
        .map((slide) => slide.trim())
        .filter(Boolean)
    );
  };

  const handleReset = () => {
    setSlides([]);
    setActiveSlide(0);
  };

  const handleNext = () => {
    setActiveSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setActiveSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleToggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', newTheme);

      return newTheme;
    });
  };

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

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const renderThemeToggle = () => (
    <button className={`w-10 h-10 ${colorClass}`} onClick={handleToggleTheme}>
      {theme === 'dark' ? '🌚' : '🌞'}
    </button>
  );

  return slides.length > 0 ? (
    <main className='flex flex-col items-center justify-center w-screen h-screen p-48'>
      <h1 className='text-4xl font-semibold leading-snug'>
        {slides[activeSlide].includes('http') ? (
          <a href={slides[activeSlide]} target='_blank' rel='noopener noreferrer'>
            {slides[activeSlide]}
          </a>
        ) : (
          slides[activeSlide]
        )}
      </h1>
      <nav className='flex gap-2 fixed top-4 right-4'>
        <button className={`w-16 h-10 ${colorClass}`} onClick={handleNext}>
          {activeSlide + 1} / {slides.length}
        </button>
        <button
          className={`w-10 h-10 ${colorClass}`}
          onClick={() =>
            alert(`
              Use the left (<) and right (>) arrow keys to navigate through the slides.
              Press the escape (esc) key to exit the presentation.
            `)
          }
        >
          ?
        </button>
        {renderThemeToggle()}
      </nav>
    </main>
  ) : (
    <main className='flex min-h-screen flex-col items-center justify-center gap-4 p-24'>
      <h1 className='text-4xl font-bold'>Text 2 Slide</h1>
      <p className='text-lg'>
        Convert your text into slides. Separate your slides with <code>two new lines</code>.
      </p>
      <form className='flex flex-col gap-4'>
        <textarea
          className={`w-full p-4 ${colorClass}`}
          placeholder='Type your text...'
          onChange={handleChange}
          value={text}
          autoFocus
          rows={20}
          cols={80}
          required
        />
        <button type='button' className={`p-4 ${colorClass}`} onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <nav className='flex gap-2 fixed top-4 right-4'>{renderThemeToggle()}</nav>
    </main>
  );
}
