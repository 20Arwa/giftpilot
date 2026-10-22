"use client";

import { useRef } from "react";
import { GiftFinderForm } from "@/components/gift-finder-form";

export default function Home() {
  const finderRef = useRef<HTMLDivElement>(null);
  function openFinder() {
    finderRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main id="top" className="overflow-x-clip">
      <header className="mx-auto flex h-[76px] w-full max-w-[1180px] items-center justify-between px-[18px] sm:h-[88px] sm:px-8">
        <a className="inline-flex shrink-0 items-center gap-2 text-[22px] font-extrabold tracking-[-1.2px] text-ink" href="#top" aria-label="GiftPilot home">
          <span className="text-2xl leading-none text-brand" aria-hidden="true">✳</span> giftpilot
        </a>
        <nav className="flex shrink-0 items-center gap-2 text-xs font-semibold text-[#5d5048] sm:gap-8" aria-label="Main navigation">
          <a className="hidden transition hover:text-brand-dark sm:inline" href="#about">Our little promise</a>
          <a className="hidden transition hover:text-brand-dark sm:inline" href="#gift-finder">Gift finder</a>
          <button className="shrink-0 whitespace-nowrap rounded-full border border-[#dccabd] bg-transparent px-3 py-2.5 text-[11px] font-bold text-ink transition hover:border-brand hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand sm:px-4 sm:text-xs" onClick={openFinder} type="button">Find a gift <span className="ml-1 text-brand" aria-hidden="true">↗</span></button>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[500px] w-full max-w-[1180px] items-center gap-9 px-[19px] pb-12 pt-5 sm:px-8 md:grid-cols-[1fr_0.94fr] md:gap-5 md:pb-14" aria-labelledby="hero-title">
        <div className="relative z-10 w-full min-w-0 py-5 sm:px-0 md:px-7">
          <p className="mb-4 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-dark"><span className="mr-1 text-sm" aria-hidden="true">✦</span> Thoughtful gifting, made easy</p>
          <h1 id="hero-title" className="font-display text-[clamp(3.4rem,8.5vw,5.3rem)] font-medium leading-[0.98] tracking-[-0.065em] text-ink">Good gifts.<br /><span className="italic text-brand">Great feelings.</span></h1>
          <p className="mt-6 w-full min-w-0 max-w-[410px] break-words text-[15px] leading-7 text-muted">The right gift says “I get you.” Find a little something that feels just right for your favorite people.</p>
          <button className="mt-6 inline-flex min-h-12 items-center rounded-full bg-brand px-6 text-xs font-bold text-white shadow-button transition hover:-translate-y-0.5 hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand" onClick={openFinder} type="button">Find your perfect gift <span className="ml-3 text-lg" aria-hidden="true">↗</span></button>
          <div className="mt-6 flex items-center gap-3 text-[11px] text-[#82766e]">
            <span className="flex pl-0.5" aria-hidden="true"><i className="-ml-0.5 grid size-6 place-items-center rounded-full border-2 border-paper bg-[#f2c9ac] not-italic">♥</i><i className="-ml-1 grid size-6 place-items-center rounded-full border-2 border-paper bg-[#d9c5dd] not-italic">✿</i><i className="-ml-1 grid size-6 place-items-center rounded-full border-2 border-paper bg-[#d8e0ae] not-italic">✦</i></span>
            <span>For all the people you love</span>
          </div>
        </div>

        <div className="relative mx-auto h-[325px] w-full max-w-[520px] overflow-hidden rounded-[46%_46%_42%_42%/49%_49%_39%_39%] bg-art-backdrop sm:h-[370px] md:h-[420px]" role="img" aria-label="A cheerful gift box illustration with the words made with a little more heart">
          <div className="absolute left-1/2 top-[8%] size-[225px] -translate-x-1/2 rounded-full bg-art-sun sm:top-[8%] sm:size-[280px]" />
          <span className="absolute left-[12%] top-[25%] z-[3] text-3xl text-brand" aria-hidden="true">✳</span>
          <span className="absolute right-[12%] top-[45%] z-[3] text-3xl text-[#8d8ba7]" aria-hidden="true">✦</span>
          <span className="absolute left-1/2 top-[3%] z-[4] w-[min(70%,220px)] -translate-x-1/2 rotate-[-5deg] text-center font-display text-[clamp(0.85rem,2.6vw,1.15rem)] italic leading-tight text-[#756357] sm:left-auto sm:right-[10%] sm:top-[14%] sm:w-[150px] sm:translate-x-0 sm:rotate-[8deg]">made with<br />a little more heart</span>
          <div className="absolute inset-x-[-5%] bottom-0 h-[25%] rounded-[50%_50%_0_0/28%_28%_0_0] bg-art-ground" />
          <div className="absolute bottom-[22%] left-1/2 z-[2] h-[181px] w-[210px] -translate-x-1/2 rotate-[-2deg] rounded-[8px_8px_20px_20px] bg-art-gift shadow-[11px_16px_0_#c9624d] max-sm:scale-[0.85] max-sm:origin-bottom">
            <div className="absolute -left-[11px] -top-6 h-[38px] w-[232px] rounded-lg bg-art-lid shadow-[0_5px_0_#d87557]" />
            <div className="absolute left-[91px] top-0 z-[1] h-full w-7 bg-art-ribbon" />
            <div className="absolute inset-x-0 top-[56px] z-[1] h-[27px] bg-art-ribbon" />
            <div className="absolute left-[54px] top-[-54px] z-[3] h-[35px] w-[58px] rotate-[20deg] rounded-[70%_20%_70%_20%] border-[12px] border-art-ribbon" />
            <div className="absolute right-[54px] top-[-54px] z-[3] h-[35px] w-[58px] -scale-x-100 rotate-[20deg] rounded-[70%_20%_70%_20%] border-[12px] border-art-ribbon" />
          </div>
          <div className="absolute bottom-[22%] right-[20%] z-[4] grid size-[90px] rotate-[8deg] place-items-center rounded-full border border-[#e5d8ca] bg-paper px-2 text-center font-display text-[11px] leading-tight text-[#66564b] sm:size-[112px] sm:text-sm">
            <span>the joy<br />is in the<br /><strong className="inline-flex items-center gap-0.5 text-brand">giving<span aria-hidden="true">♥</span></strong></span>
          </div>
        </div>
      </section>

      <section id="about" className="bg-cream px-5 py-14 text-center sm:px-8 sm:py-[68px]" aria-labelledby="about-title">
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-dark">Less scrolling, more celebrating</p>
        <h2 id="about-title" className="font-display text-[clamp(1.8rem,4vw,2.45rem)] font-medium tracking-tight text-ink">A small nudge toward the <span className="italic text-brand">perfect</span> thing.</h2>
        <div className="mx-auto mt-8 flex max-w-[790px] flex-col items-start gap-3 text-xs font-semibold text-[#695b51] sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
          <p><span className="mr-2 text-[10px] tracking-widest text-brand-dark">01</span> Tell us a little about them</p><i className="hidden text-[#d4ad89] sm:inline" aria-hidden="true">✳</i>
          <p><span className="mr-2 text-[10px] tracking-widest text-brand-dark">02</span> Set a comfy budget</p><i className="hidden text-[#d4ad89] sm:inline" aria-hidden="true">✳</i>
          <p><span className="mr-2 text-[10px] tracking-widest text-brand-dark">03</span> Find a gift that feels right</p>
        </div>
      </section>

      <div ref={finderRef} className="scroll-mt-[0vh]"><GiftFinderForm /></div>

      <footer className="flex min-h-[115px] flex-col items-center justify-between gap-3 border-t border-line px-6 py-7 text-center sm:flex-row sm:px-8 sm:text-left lg:px-[max(2rem,calc((100vw_-_1080px)_/_2))]">
        <a className="inline-flex items-center gap-2 text-lg font-extrabold tracking-[-1px] text-ink" href="#top"><span className="text-brand" aria-hidden="true">✳</span> giftpilot</a>
        <p className="text-[10px] text-[#887b71]">A little help finding a lot of heart.</p>
        <span className="text-[10px] text-[#887b71]">Made for the people who make life lovely. <b className="text-brand" aria-hidden="true">♥</b></span>
      </footer>
    </main>
  );
}
